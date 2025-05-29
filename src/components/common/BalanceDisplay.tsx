'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface BalanceDisplayProps {
  className?: string;
}

export default function BalanceDisplay({ className = '' }: BalanceDisplayProps) {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchBalance();
    }
  }, [session]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/balance');
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Link
      href="/account/deposit"
      className={`flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${className}`}
      title="Số dư tài khoản - Click để nạp tiền"
    >
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
          />
        </svg>
        {loading ? (
          <div className="flex items-center space-x-1">
            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
            <span className="text-xs font-medium">Đang tải...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-90">Số dư</span>
            <span className="text-sm font-bold">
              {formatCurrency(balance)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
} 