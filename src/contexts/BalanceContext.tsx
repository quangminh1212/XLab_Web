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

interface BalanceProviderProps {
  children: ReactNode;
}

export function BalanceProvider({ children }: BalanceProviderProps) {
  console.log('🚀 BalanceProvider rendering');
  
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMountedRef = useRef(true);
  const initialFetchDoneRef = useRef(false);
  
  // Log thông tin session
  useEffect(() => {
    console.log('🔑 BalanceProvider session status:', status);
    console.log('👤 BalanceProvider session user:', session?.user?.email || 'None');
  }, [session, status]);

  const fetchBalance = useCallback(
    async (force = false): Promise<void> => {
      if (!session?.user?.email || status !== 'authenticated') {
        if (status === 'unauthenticated') setLoading(false);
        return;
      }

      // Đảm bảo luôn fetch khi chưa từng fetch thành công
      const now = Date.now();
      const shouldUseCachedValue = !force && initialFetchDoneRef.current && 
                                  now - lastFetchTime < CACHE_DURATION && cachedBalance > 0;
      
      console.log(`💰 Fetch balance - Should use cached value? ${shouldUseCachedValue} (cached: ${cachedBalance}, initialFetch: ${initialFetchDoneRef.current})`);
      
      if (shouldUseCachedValue) {
        if (isMountedRef.current) {
          console.log(`💰 Using cached balance: ${cachedBalance}`);
          setBalance(cachedBalance);
          setLoading(false);
        }
        return;
      }

      // Tránh multiple requests cùng lúc
      if (isCurrentlyFetching) {
        return;
      }

      isCurrentlyFetching = true;
      console.log('🔄 Fetching balance...');

      try {
        if (isMountedRef.current) {
          setError(null);
        }

        // Sử dụng retry mechanism để thử lại 3 lần nếu lỗi
        let attempts = 0;
        const maxAttempts = 3;
        let success = false;
        let errorMessage = '';

        while (attempts < maxAttempts && !success) {
          try {
            attempts++;
            console.log(`Attempt ${attempts} to fetch balance...`);
            
            const response = await fetch('/api/user/balance', {
              cache: 'no-cache', // Đảm bảo không cache ở browser level
              headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
              },
              credentials: 'include', // Đảm bảo gửi cookies và session data
            });

            console.log(`Balance fetch response status: ${response.status}`);
            
            if (response.ok) {
              const data = await response.json();
              const newBalance = data.balance || 0;

              // Chỉ update state nếu component vẫn mounted
              if (isMountedRef.current) {
                setBalance(newBalance);
                setLastUpdated(new Date());
                
                // Đánh dấu là đã fetch thành công
                initialFetchDoneRef.current = true;
              }

              cachedBalance = newBalance;
              lastFetchTime = now;

              // Chỉ log khi không phải cached để giảm spam log
              if (!data.cached) {
                console.log(`💰 Balance updated: ${newBalance.toLocaleString('vi-VN')} VND`);
              }
              
              success = true;
              break;
            } else {
              const errorData = await response.json().catch(() => ({}));
              errorMessage = errorData.error || response.statusText || 'Failed to fetch balance';
              
              console.warn(`Balance fetch attempt ${attempts} failed: ${errorMessage} (Status: ${response.status})`);
              
              // Wait 500ms before retry
              if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
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
          console.error(`Failed to fetch balance after ${maxAttempts} attempts: ${errorMessage}`);
          // Vẫn set loading thành false thay vì throw error để tránh crash app
          if (isMountedRef.current) {
            setError(`Failed to fetch balance: ${errorMessage}`);
          }
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
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
    };
  }, []);

  // Initial fetch khi user login
  useEffect(() => {
    if (session?.user?.email && status === 'authenticated') {
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
      // Chỉ refresh khi đã hết cache và user đang active
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
  
  // Debug log
  console.log('⚡ useBalance hook called:', {
    balance: context.balance,
    loading: context.loading,
    error: context.error,
    lastUpdated: context.lastUpdated
  });
  
  return context;
}
