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
const CACHE_DURATION = 10000; // 10 seconds (giảm từ 60s xuống 10s)
const AUTO_REFRESH_INTERVAL = 15000; // 15 seconds (giảm từ 5 phút xuống 15 giây)

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

  const fetchBalance = useCallback(
    async (force = false): Promise<void> => {
      if (!session?.user?.email || status !== 'authenticated') {
        if (status === 'unauthenticated') setLoading(false);
        return;
      }

      // Luôn hiển thị cached balance trước để tránh hiển thị 0
      if (cachedBalance > 0 && isMountedRef.current) {
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
        return;
      }

      // Set timeout cho loading state để tránh mắc kẹt
      const loadingTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          console.log('💰 Loading timeout - showing cached balance');
          setLoading(false);
          // Vẫn hiển thị cached balance nếu có
          if (cachedBalance > 0) {
            setBalance(cachedBalance);
          }
        }
      }, 3000); // 3 giây timeout cho loading state

      isCurrentlyFetching = true;

      try {
        if (isMountedRef.current) {
          setError(null);
          // Không set loading = true nếu đã có cached balance để tránh UI nhấp nháy
          if (cachedBalance === 0) {
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

              cachedBalance = newBalance;
              lastFetchTime = now;
              
              success = true;
              break;
            }
            const errorData = await response.json().catch(() => ({}));
            errorMessage = errorData.error || response.statusText || 'Failed to fetch balance';
            
            console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage} (Status: ${response.status})`);
            
            // Wait 500ms before retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          } catch (err) {
            errorMessage = err instanceof Error ? err.message : 'Unknown network error';
            console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage}`);
            
            // Wait 500ms before retry
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }

        if (!success) {
          // Ensure we clear loading state even on error
          clearTimeout(loadingTimeout);
          throw new Error(`Failed to fetch balance after ${maxAttempts} attempts: ${errorMessage}`);
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

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
