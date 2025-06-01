'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useBalance } from '@/contexts/BalanceContext';

interface BalanceDisplayProps {
  className?: string;
}

export default function BalanceDisplay({ className = '' }: BalanceDisplayProps) {
  const { data: session } = useSession();
  const { balance, loading } = useBalance();

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
      className={`group flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors duration-300 ${className}`}
      title="Số dư tài khoản - Click để nạp tiền"
    >
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4 text-teal-600 group-hover:text-teal-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
          />
        </svg>
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-teal-600"></div>
            <span className="text-sm font-medium text-teal-600">Đang tải...</span>
          </div>
        ) : (
          <span className="text-sm font-bold text-teal-600 group-hover:text-teal-700 transition-colors whitespace-nowrap">
            {formatCurrency(balance)}
          </span>
        )}
      </div>
    </Link>
  );
} 