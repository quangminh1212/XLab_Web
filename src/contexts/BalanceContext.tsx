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

// Export context để có thể truy cập trực tiếp nếu cần
export const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// Cache để tránh gọi API quá nhiều - tăng thời gian cache
let lastFetchTime = 0;
let cachedBalance = 0;
let isCurrentlyFetching = false;
const CACHE_DURATION = 5000; // 5 seconds (giảm từ 10s xuống 5s)
const AUTO_REFRESH_INTERVAL = 10000; // 10 seconds (giảm từ 15s xuống 10s)

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

  // Force re-render when session changes
  useEffect(() => {
    console.log('🔑 Session changed:', { status, email: session?.user?.email });
  }, [session, status]);

  const fetchBalance = useCallback(
    async (force = false): Promise<void> => {
      if (!session?.user?.email || status !== 'authenticated') {
        if (status === 'unauthenticated') setLoading(false);
        return;
      }

      // Debug: log initial state
      console.log('Begin fetchBalance:', { cachedBalance, force });

      // Luôn hiển thị cached balance trước để tránh hiển thị 0
      if (cachedBalance > 0 && isMountedRef.current) {
        console.log('Showing cached balance immediately:', cachedBalance);
        setBalance(cachedBalance);
      }

      // Kiểm tra cache nếu không force
      const now = Date.now();
      if (!force && now - lastFetchTime < CACHE_DURATION && cachedBalance > 0) {
        if (isMountedRef.current) {
          console.log('💰 Using cached balance:', cachedBalance);
          setBalance(cachedBalance);
          setLoading(false);
        }
        return;
      }

      // Tránh multiple requests cùng lúc
      if (isCurrentlyFetching && !force) {
        console.log('Already fetching, skipping duplicate request');
        return;
      }

      // Set timeout cho loading state để tránh mắc kẹt - giảm xuống 1 giây
      const loadingTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          console.log('💰 Loading timeout - showing cached balance');
          setLoading(false);
          // Vẫn hiển thị cached balance nếu có
          if (cachedBalance > 0) {
            setBalance(cachedBalance);
          }
        }
      }, 1000); // 1 giây timeout cho loading state

      isCurrentlyFetching = true;

      try {
        if (isMountedRef.current) {
          setError(null);
          // Không set loading = true nếu đã có cached balance để tránh UI nhấp nháy
          if (cachedBalance === 0) {
            console.log('Setting loading=true because no cached balance');
            setLoading(true);
          }
        }

        // Sử dụng retry mechanism để thử lại 3 lần nếu lỗi
        let attempts = 0;
        const maxAttempts = 3;
        let success = false;
        let errorMessage = '';

        while (attempts < maxAttempts && !success) {
          try {
            attempts++;
            
            // Thêm timestamp để đảm bảo không bị cache
            const timestamp = new Date().getTime();
            console.log(`Fetch attempt ${attempts}: /api/user/balance?t=${timestamp}&force=${force}`);
            
            const response = await fetch(`/api/user/balance?t=${timestamp}&force=${force}`, {
              method: 'GET',
              credentials: 'include',
              cache: 'no-cache', // Đảm bảo không cache ở browser level
              headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
              },
            });

            if (response.ok) {
              const data = await response.json();
              // Ensure balance is always a number
              const newBalance = typeof data.balance === 'number' ? data.balance : 0;
              
              // Clear loading timeout
              clearTimeout(loadingTimeout);

              // Log cho debug
              console.log(`💰 Balance API response:`, data);

              // Chỉ update state nếu component vẫn mounted
              if (isMountedRef.current) {
                console.log(`💰 Setting balance to:`, newBalance);
                setBalance(newBalance);
                setLastUpdated(new Date());
                setLoading(false);
              }

              // Luôn cập nhật cache dù balance là 0
              cachedBalance = newBalance;
              lastFetchTime = now;
              
              success = true;
              break;
            }
            const errorData = await response.json().catch(() => ({}));
            errorMessage = errorData.error || response.statusText || 'Failed to fetch balance';
            
            console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage} (Status: ${response.status})`);
            
            // Wait 300ms before retry - giảm thời gian chờ retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          } catch (err) {
            errorMessage = err instanceof Error ? err.message : 'Unknown network error';
            console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage}`);
            
            // Wait 300ms before retry - giảm thời gian chờ retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        }

        if (!success) {
          // Ensure we clear loading state even on error
          clearTimeout(loadingTimeout);
          // Không throw error mà vẫn hiển thị cached balance
          console.error(`Failed to fetch balance after ${maxAttempts} attempts: ${errorMessage}`);
          if (isMountedRef.current) {
            setError(errorMessage);
            setLoading(false);
            // Vẫn giữ balance cũ nếu có
          }
        }
      } catch (err) {
        // Clear loading timeout
        clearTimeout(loadingTimeout);
        
        console.error('Error fetching balance:', err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
          
          // Keep showing cached balance on error if available
          if (cachedBalance > 0) {
            setBalance(cachedBalance);
          }
        }
      } finally {
        // Clear loading timeout
        clearTimeout(loadingTimeout);
        
        if (isMountedRef.current) {
          setLoading(false);
        }
        isCurrentlyFetching = false;
      }
    },
    [session?.user?.email, status],
  );

  const refreshBalance = useCallback(async (): Promise<void> => {
    await fetchBalance(true); // Force refresh
  }, [fetchBalance]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initial fetch khi user login - force fetch mỗi khi session/email thay đổi
  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
      console.log('🔄 Initial balance fetch for:', session.user.email);
      fetchBalance(true);
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

    console.log('⏱️ Setting up auto refresh interval');
    const interval = setInterval(() => {
      // Chỉ refresh khi đã hết cache và user đang active
      if (document.visibilityState === 'visible' && isMountedRef.current) {
        console.log('⏱️ Auto refresh triggered');
        fetchBalance(); // Sẽ dùng cache nếu chưa hết hạn
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [session?.user?.email, status, fetchBalance]);

  // Refresh khi user quay lại tab (nếu cache đã hết hạn)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user?.email && isMountedRef.current) {
        console.log('📱 Visibility changed, refreshing balance');
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

  // Debug log
  useEffect(() => {
    console.log('🔄 BalanceContext state updated:', { balance, loading, error });
  }, [balance, loading, error]);

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
