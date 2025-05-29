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
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Link
      href="/account/deposit"
      className={`group relative flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-3 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 hover:shadow-teal-500/25 border border-teal-400/20 ${className}`}
      title="Số dư tài khoản - Click để nạp tiền"
    >
      <div className="relative z-10 flex items-center space-x-2.5">
        <div className="relative">
          <div className="p-1 rounded-full bg-white/10 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-white group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2.5} 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
              />
            </svg>
          </div>
          <div className="absolute -inset-1 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
        </div>
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white/70"></div>
            <span className="text-sm font-medium">Đang tải...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-90 tracking-wide leading-none">Số dư</span>
            <span className="text-sm font-bold tracking-wide whitespace-nowrap leading-none mt-0.5">
              {formatCurrency(balance)}
            </span>
          </div>
        )}
      </div>
      {/* Multiple hover effects */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
} 