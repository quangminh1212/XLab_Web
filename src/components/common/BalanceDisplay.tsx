'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { memo, useMemo, useEffect } from 'react';
import { useBalance } from '@/contexts/BalanceContext';

interface BalanceDisplayProps {
  className?: string;
}

function BalanceDisplay({ className = '' }: BalanceDisplayProps) {
  const { data: session } = useSession();
  const { balance, loading, refreshBalance } = useBalance();

  // Auto refresh balance when component mounts
  useEffect(() => {
    if (session?.user) {
      refreshBalance();
    }
  }, [session?.user, refreshBalance]);

  const formattedBalance = useMemo(() => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(balance);
  }, [balance]);

  if (!session?.user) {
    return null;
  }

  return (
    <Link
      href="/account/deposit"
      className={`group flex items-center space-x-1.5 sm:space-x-2 text-teal-600 hover:text-teal-700 transition-colors duration-300 ${className}`}
      title="Số dư tài khoản - Click để nạp tiền"
    >
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 group-hover:text-teal-700 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
        {loading ? (
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 border-t-2 border-b-2 border-teal-600"></div>
            <span className="text-xs sm:text-sm font-medium text-teal-600">Đang tải...</span>
          </div>
        ) : (
          <span className="text-xs sm:text-sm font-bold text-teal-600 group-hover:text-teal-700 transition-colors whitespace-nowrap">
            {formattedBalance}
          </span>
        )}
      </div>
    </Link>
  );
}

export default memo(BalanceDisplay);
