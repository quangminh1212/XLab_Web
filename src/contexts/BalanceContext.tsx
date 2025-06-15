'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface BalanceContextType {
  balance: number;
  loading: boolean;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  loading: true,
  refreshBalance: async () => {},
});

export const useBalance = () => useContext(BalanceContext);

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider = ({ children }: BalanceProviderProps) => {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch balance on initial load and when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      refreshBalance();
    } else {
      setLoading(false);
    }
  }, [status]);

  // Function to refresh balance from API
  const refreshBalance = async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    try {
      // For demo purposes, we'll use a fixed balance of 57000
      // In a real app, you would fetch this from an API
      // const response = await fetch('/api/user/balance');
      // const data = await response.json();
      // setBalance(data.balance);
      
      // Using fixed balance for demo
      setBalance(57000);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    balance,
    loading,
    refreshBalance,
  };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
};

export default BalanceProvider;
