'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
const CACHE_DURATION = 30000; // 30 seconds

interface BalanceProviderProps {
  children: ReactNode;
}

export function BalanceProvider({ children }: BalanceProviderProps) {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBalance = async (force = false): Promise<void> => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    // Kiểm tra cache nếu không force
    const now = Date.now();
    if (!force && (now - lastFetchTime) < CACHE_DURATION && cachedBalance > 0) {
      setBalance(cachedBalance);
      setLoading(false);
      return;
    }

    // Tránh multiple requests cùng lúc
    if (isCurrentlyFetching) {
      return;
    }

    isCurrentlyFetching = true;

    try {
      setError(null);
      const response = await fetch('/api/user/balance');
      
      if (response.ok) {
        const data = await response.json();
        const newBalance = data.balance || 0;
        
        setBalance(newBalance);
        cachedBalance = newBalance;
        lastFetchTime = now;
        setLastUpdated(new Date());
        
        console.log(`💰 Balance updated: ${newBalance} VND (cached: ${data.cached || false})`);
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      isCurrentlyFetching = false;
    }
  };

  const refreshBalance = async (): Promise<void> => {
    setLoading(true);
    await fetchBalance(true); // Force refresh
  };

  // Initial fetch khi user login
  useEffect(() => {
    if (session?.user) {
      fetchBalance();
    } else {
      setBalance(0);
      setLoading(false);
      cachedBalance = 0;
      lastFetchTime = 0;
    }
  }, [session?.user?.email]);

  // Auto refresh every 2 minutes (chỉ 1 lần cho toàn app)
  useEffect(() => {
    if (!session?.user) return;

    const interval = setInterval(() => {
      fetchBalance(); // Sẽ dùng cache nếu chưa hết hạn
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [session?.user?.email]);

  const value: BalanceContextType = {
    balance,
    loading,
    error,
    refreshBalance,
    lastUpdated
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
} 