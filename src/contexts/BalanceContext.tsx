'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { useSession } from 'next-auth/react';

interface BalanceContextType {
  balance: number;
  loading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
  lastUpdated: Date | null;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// Cache để tránh gọi API quá nhiều - tăng thời gian cache
let lastFetchTime = 0;
let cachedBalance = 0;
let isCurrentlyFetching = false;
const CACHE_DURATION = 60000; // 60 seconds (tăng từ 30s lên 60s)
const AUTO_REFRESH_INTERVAL = 300000; // 5 minutes (tăng từ 2 phút lên 5 phút)
const FETCH_TIMEOUT = 10000; // 10 seconds timeout
const DEBUG_MODE = true; // Chế độ debug

interface BalanceProviderProps {
  children: ReactNode;
}

export function BalanceProvider({ children }: BalanceProviderProps) {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMountedRef = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackBalanceRef = useRef<number>(0); // Giá trị fallback khi tất cả đều thất bại

  // Debug logger
  const logDebug = useCallback((message: string, data?: any) => {
    if (DEBUG_MODE) {
      console.log(`[BalanceContext] ${message}`, data || '');
    }
  }, []);

  // Helper để xử lý timeout cho fetch
  const fetchWithTimeout = useCallback(async (url: string, options: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const { signal } = controller;
    
    logDebug(`Fetching ${url} with timeout ${FETCH_TIMEOUT}ms`);
    
    // Tạo promise cho timeout
    const timeoutPromise = new Promise<Response>((_, reject) => {
      fetchTimeoutRef.current = setTimeout(() => {
        controller.abort();
        reject(new Error(`Request timeout after ${FETCH_TIMEOUT}ms`));
      }, FETCH_TIMEOUT);
    });
    
    try {
      // Race giữa fetch và timeout
      return await Promise.race([
        fetch(url, { ...options, signal }),
        timeoutPromise
      ]) as Response;
    } finally {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    }
  }, [logDebug]);

  // Trực tiếp truy cập localStorage để lấy số dư fallback
  const getFallbackBalance = useCallback(() => {
    try {
      const storedBalance = localStorage.getItem('xlab_user_balance');
      if (storedBalance) {
        const parsedBalance = JSON.parse(storedBalance);
        if (typeof parsedBalance === 'number' && !isNaN(parsedBalance)) {
          logDebug(`Lấy balance từ localStorage: ${parsedBalance}`);
          return parsedBalance;
        }
      }
    } catch (err) {
      logDebug('Lỗi khi đọc balance từ localStorage', err);
    }
    return 0;
  }, [logDebug]);

  // Lưu số dư vào localStorage để dùng làm fallback
  const saveBalanceToLocalStorage = useCallback((balanceValue: number) => {
    try {
      localStorage.setItem('xlab_user_balance', JSON.stringify(balanceValue));
      logDebug(`Đã lưu balance vào localStorage: ${balanceValue}`);
    } catch (err) {
      logDebug('Lỗi khi lưu balance vào localStorage', err);
    }
  }, [logDebug]);

  const fetchBalance = useCallback(
    async (force = false): Promise<void> => {
      if (!session?.user?.email || status !== 'authenticated') {
        if (status === 'unauthenticated') {
          logDebug('User chưa đăng nhập, đặt loading = false');
          setLoading(false);
        }
        return;
      }

      logDebug(`Bắt đầu fetchBalance (force=${force})`);

      // Kiểm tra cache nếu không force
      const now = Date.now();
      if (!force && now - lastFetchTime < CACHE_DURATION && cachedBalance >= 0) {
        if (isMountedRef.current) {
          logDebug(`Sử dụng cache balance: ${cachedBalance}`);
          setBalance(cachedBalance);
          setLoading(false);
        }
        return;
      }

      // Tránh multiple requests cùng lúc
      if (isCurrentlyFetching) {
        logDebug('Đang fetch balance, bỏ qua request mới');
        return;
      }

      isCurrentlyFetching = true;
      logDebug('Đặt isCurrentlyFetching = true');

      try {
        if (isMountedRef.current) {
          setError(null);
        }

        // Khởi tạo fallback balance từ localStorage nếu chưa có
        if (fallbackBalanceRef.current === 0) {
          fallbackBalanceRef.current = getFallbackBalance();
          logDebug(`Khởi tạo fallbackBalance: ${fallbackBalanceRef.current}`);
        }

        // Sử dụng retry mechanism để thử lại 3 lần nếu lỗi
        let attempts = 0;
        const maxAttempts = 3;
        let success = false;
        let errorMessage = '';

        while (attempts < maxAttempts && !success) {
          try {
            attempts++;
            logDebug(`Attempt ${attempts}/${maxAttempts} to fetch balance`);
            
            const response = await fetchWithTimeout('/api/user/balance', {
              cache: 'no-cache', // Đảm bảo không cache ở browser level
              headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
              },
            });

            logDebug(`Fetch response status: ${response.status}`);

            if (response.ok) {
              const data = await response.json();
              const newBalance = data.balance || 0;
              logDebug(`Nhận được balance: ${newBalance}`, data);

              // Lưu vào fallback
              fallbackBalanceRef.current = newBalance;
              saveBalanceToLocalStorage(newBalance);

              // Chỉ update state nếu component vẫn mounted
              if (isMountedRef.current) {
                setBalance(newBalance);
                setLastUpdated(new Date());
                setLoading(false);
              }

              cachedBalance = newBalance;
              lastFetchTime = now;

              // Chỉ log khi không phải cached để giảm spam log
              if (!data.cached) {
                console.log(`💰 Balance updated: ${newBalance.toLocaleString('vi-VN')} VND`);
              }
              
              // Nếu có lỗi đồng bộ nhưng vẫn trả về được balance từ cache
              if (data.stale && data.syncError) {
                console.warn(`Using stale balance data due to sync error: ${data.syncError}`);
                if (isMountedRef.current) {
                  setError(`Lỗi đồng bộ số dư: ${data.syncError}`);
                }
              } else {
                if (isMountedRef.current) {
                  setError(null);
                }
              }
              
              success = true;
              break;
            } else {
              const errorData = await response.json().catch(() => ({}));
              errorMessage = errorData.error || response.statusText || 'Failed to fetch balance';
              
              logDebug(`Balance fetch attempt ${attempts} failed: ${errorMessage} (Status: ${response.status})`, errorData);
              
              // Wait longer between retries
              if (attempts < maxAttempts) {
                logDebug(`Waiting ${800 * attempts}ms before retry`);
                await new Promise(resolve => setTimeout(resolve, 800 * attempts));
              }
            }
          } catch (err) {
            errorMessage = err instanceof Error ? err.message : 'Unknown network error';
            logDebug(`Balance fetch attempt ${attempts} failed with error:`, err);
            
            // Wait longer between retries
            if (attempts < maxAttempts) {
              logDebug(`Waiting ${800 * attempts}ms before retry`);
              await new Promise(resolve => setTimeout(resolve, 800 * attempts));
            }
          }
        }

        if (!success) {
          logDebug(`All ${maxAttempts} attempts failed. Using fallback balance: ${fallbackBalanceRef.current}`);
          
          // Sử dụng fallback balance từ localStorage nếu tất cả attempts đều thất bại
          if (isMountedRef.current) {
            // Vẫn hiển thị balance từ fallback
            setBalance(fallbackBalanceRef.current);
            setError(`Không thể tải số dư. Đang hiển thị số dư đã lưu trước đó.`);
            setLoading(false);
          }
          
          throw new Error(`Failed to fetch balance after ${maxAttempts} attempts: ${errorMessage}`);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        logDebug('Final error in fetchBalance:', err);
        
        if (isMountedRef.current) {
          // Vẫn hiển thị error nhưng không ảnh hưởng đến balance từ fallback
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      } finally {
        logDebug('Đặt isCurrentlyFetching = false');
        isCurrentlyFetching = false;
      }
    },
    [session?.user?.email, status, fetchWithTimeout, getFallbackBalance, saveBalanceToLocalStorage, logDebug],
  );

  const refreshBalance = useCallback(async (): Promise<void> => {
    logDebug('Gọi refreshBalance (force=true)');
    if (isMountedRef.current) {
      setLoading(true);
    }
    await fetchBalance(true); // Force refresh
  }, [fetchBalance, logDebug]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      logDebug('Component unmounting, cleanup');
      isMountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [logDebug]);

  // Initial fetch khi user login
  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
      logDebug('User đã đăng nhập, fetch balance');
      fetchBalance();
    } else if (status === 'unauthenticated') {
      logDebug('User chưa đăng nhập, reset balance');
      setBalance(0);
      setLoading(false);
      cachedBalance = 0;
      lastFetchTime = 0;
      setError(null);
    }
  }, [session?.user?.email, status, fetchBalance, logDebug]);

  // Auto refresh với tần suất thấp hơn và chỉ khi user active
  useEffect(() => {
    if (!session?.user?.email || status !== 'authenticated') return;

    logDebug('Thiết lập auto refresh interval');
    const interval = setInterval(() => {
      // Chỉ refresh khi đã hết cache và user đang active
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        logDebug('Auto refresh triggered');
        fetchBalance(); // Sẽ dùng cache nếu chưa hết hạn
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      logDebug('Xóa auto refresh interval');
      clearInterval(interval);
    };
  }, [session?.user?.email, status, fetchBalance, logDebug]);

  // Refresh khi user quay lại tab (nếu cache đã hết hạn)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user?.email && isMountedRef.current) {
        const now = Date.now();
        if (now - lastFetchTime > CACHE_DURATION) {
          logDebug('Visibility change triggered refresh');
          fetchBalance();
        }
      }
    };

    logDebug('Thiết lập visibility change listener');
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      logDebug('Xóa visibility change listener');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session?.user?.email, fetchBalance, logDebug]);

  const value: BalanceContextType = {
    balance,
    loading,
    error,
    refreshBalance,
    lastUpdated,
  };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
