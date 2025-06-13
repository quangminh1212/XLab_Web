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

      console.log('🔄 Fetching balance for:', session.user.email);

      // Kiểm tra cache nếu không force
      const now = Date.now();
      if (!force && now - lastFetchTime < CACHE_DURATION && cachedBalance >= 0) {
        if (isMountedRef.current) {
          console.log('💰 Using cached balance:', cachedBalance);
          // Sử dụng setTimeout để đảm bảo React không bỏ qua state update trong strict mode
          setBalance(cachedBalance);
          // Dùng timeout ngắn để đảm bảo state được cập nhật tuần tự
          setTimeout(() => {
            if (isMountedRef.current) {
              console.log('⏱️ Resetting loading state after using cache');
              setLoading(false);
            }
          }, 0);
        }
        return;
      }

      // Tránh multiple requests cùng lúc
      if (isCurrentlyFetching) {
        console.log('⏳ Balance fetch already in progress, skipping');
        return;
      }

      if (isMountedRef.current) {
        setLoading(true); // Đảm bảo loading state được set trước khi fetch
      }
      
      isCurrentlyFetching = true;

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
            
            const response = await fetch('/api/user/balance', {
              cache: 'no-cache', // Đảm bảo không cache ở browser level
              headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
              },
            });

            if (response.ok) {
              const data = await response.json();
              const newBalance = data.balance || 0;
              console.log(`🔢 Received balance from API: ${newBalance}`);

              // Chỉ update state nếu component vẫn mounted
              if (isMountedRef.current) {
                console.log(`💰 Setting balance in state: ${newBalance}`);
                // Gọi setState trong một promise chain để đảm bảo thứ tự cập nhật
                Promise.resolve().then(() => {
                  if (isMountedRef.current) {
                    setBalance(newBalance);
                    setLastUpdated(new Date());
                  }
                });
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
          throw new Error(`Failed to fetch balance after ${maxAttempts} attempts: ${errorMessage}`);
        }
      } catch (err) {
        console.error('Error fetching balance:', err);
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        // Đảm bảo loading state được reset sau một chút
        setTimeout(() => {
          if (isMountedRef.current) {
            console.log('✅ Balance fetch completed, turning off loading state');
            setLoading(false);
          } else {
            console.log('⚠️ Component unmounted during balance fetch');
          }
        }, 50); // Delay nhỏ để đảm bảo các state updates trước đã được xử lý

        isCurrentlyFetching = false;
      }
    },
    [session?.user?.email, status],
  );

  const refreshBalance = useCallback(async (): Promise<void> => {
    console.log('🔄 Manual refresh balance requested');
    if (isMountedRef.current) {
      // Đảm bảo loading state được hiển thị
      setLoading(true);
      
      // Đặt timeout trước khi fetch để đảm bảo UI kịp cập nhật
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    try {
      await fetchBalance(true); // Force refresh
    } catch (error) {
      console.error('❌ Error in refreshBalance:', error);
      // Đảm bảo loading state được reset trong trường hợp lỗi
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
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
  return context;
}
