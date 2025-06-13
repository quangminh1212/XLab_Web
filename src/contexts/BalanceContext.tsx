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

// Cache để tránh gọi API quá nhiều
let lastFetchTime = 0;
let cachedBalance = 0;
let isCurrentlyFetching = false;
const CACHE_DURATION = 30000; // 30 seconds (giảm từ 60s xuống 30s để cập nhật thường xuyên hơn)
const AUTO_REFRESH_INTERVAL = 180000; // 3 minutes (giảm từ 5 phút xuống 3 phút)
const RETRY_TIMEOUT = 300; // 300ms (giảm từ 500ms)
const MAX_RETRIES = 5; // Tăng từ 3 lần lên 5 lần

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

  const fetchBalance = useCallback(
    async (force = false): Promise<void> => {
      if (!session?.user?.email || status !== 'authenticated') {
        if (status === 'unauthenticated') setLoading(false);
        return;
      }

      // Trả về giá trị cache ngay lập tức nếu có
      const now = Date.now();
      if (!force && now - lastFetchTime < CACHE_DURATION && cachedBalance >= 0) {
        if (isMountedRef.current) {
          setBalance(cachedBalance);
          setLoading(false);
        }
        
        // Nếu đang tiếp tục dùng cache, không cần gọi API
        return;
      }

      // Set timeout để đảm bảo API call sẽ không block UI quá lâu
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      fetchTimeoutRef.current = setTimeout(() => {
        if (isCurrentlyFetching && isMountedRef.current) {
          console.warn('Balance fetch is taking too long, using cached value');
          setLoading(false);
        }
      }, 5000);

      // Tránh multiple requests cùng lúc
      if (isCurrentlyFetching) {
        return;
      }

      // Đánh dấu đang fetch để tránh gọi nhiều request
      isCurrentlyFetching = true;

      try {
        if (isMountedRef.current) {
          setError(null);
        }

        // Sử dụng retry mechanism để thử lại nếu lỗi
        let attempts = 0;
        let success = false;
        let errorMessage = '';

        while (attempts < MAX_RETRIES && !success) {
          try {
            attempts++;
            
            const response = await fetch('/api/user/balance', {
              cache: 'no-cache', 
              headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
              },
              // Thêm timeout cho fetch request
              signal: AbortSignal.timeout(3000) // 3 seconds timeout
            });

            if (response.ok) {
              const data = await response.json();
              const newBalance = data.balance ?? 0;

              // Chỉ update state nếu component vẫn mounted
              if (isMountedRef.current) {
                setBalance(newBalance);
                setLastUpdated(new Date());
                setLoading(false); // Turn off loading khi có kết quả
              }

              // Update cache
              cachedBalance = newBalance;
              lastFetchTime = now;
              
              success = true;
              break;
            } else {
              const errorData = await response.json().catch(() => ({}));
              errorMessage = errorData.error || response.statusText || 'Failed to fetch balance';
              
              console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage} (Status: ${response.status})`);
              
              // Giảm thời gian chờ giữa các lần retry
              if (attempts < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_TIMEOUT));
              }
            }
          } catch (err) {
            errorMessage = err instanceof Error ? err.message : 'Unknown network error';
            console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage}`);
            
            if (attempts < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, RETRY_TIMEOUT));
            }
          }
        }

        if (!success) {
          // Nếu không fetch được, vẫn dùng cache nếu có
          if (cachedBalance > 0) {
            console.warn(`Using cached balance (${cachedBalance}) after failed fetch attempts`);
            if (isMountedRef.current) {
              setBalance(cachedBalance);
            }
          } else {
            throw new Error(`Failed to fetch balance after ${MAX_RETRIES} attempts: ${errorMessage}`);
          }
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        // Clear timeout
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
          fetchTimeoutRef.current = null;
        }
        
        if (isMountedRef.current) {
          setLoading(false);
        }
        
        // Đánh dấu đã fetch xong
        isCurrentlyFetching = false;
      }
    },
    [session?.user?.email, status],
  );

  const refreshBalance = useCallback(async (): Promise<void> => {
    if (isMountedRef.current) {
      setLoading(true);
    }
    await fetchBalance(true); // Force refresh
  }, [fetchBalance]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  // Initial fetch khi user login - dùng giá trị cache ngay nếu có
  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
      // Sử dụng cache ngay nếu có
      if (cachedBalance > 0 && Date.now() - lastFetchTime < CACHE_DURATION) {
        setBalance(cachedBalance);
        setLoading(false);
      }
      // Luôn fetch để cập nhật
      fetchBalance();
    } else if (status === 'unauthenticated') {
      setBalance(0);
      setLoading(false);
      cachedBalance = 0;
      lastFetchTime = 0;
      setError(null);
    }
  }, [session?.user?.email, status, fetchBalance]);

  // Auto refresh với tần suất thấp hơn và chỉ khi user active
  useEffect(() => {
    if (!session?.user?.email || status !== 'authenticated') return;

    const interval = setInterval(() => {
      // Chỉ refresh khi user đang active
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        fetchBalance(); // Sẽ dùng cache nếu chưa hết hạn
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [session?.user?.email, status, fetchBalance]);

  // Refresh khi user quay lại tab (nếu cache đã hết hạn)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user?.email && isMountedRef.current) {
        const now = Date.now();
        if (now - lastFetchTime > CACHE_DURATION) {
          fetchBalance();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session?.user?.email, fetchBalance]);

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
