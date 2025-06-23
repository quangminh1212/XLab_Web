'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import { useBalance } from '@/contexts/BalanceContext';
import { useLanguage } from '@/contexts/LanguageContext';
<<<<<<< HEAD
<<<<<<< HEAD
import { formatCurrency, convertCurrency } from '@/shared/utils/formatCurrency';
=======
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
=======
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d

interface BalanceDisplayProps {
  className?: string;
}

function BalanceDisplay({ className = '' }: BalanceDisplayProps) {
  const { data: session } = useSession();
  const { balance, loading } = useBalance();
<<<<<<< HEAD
<<<<<<< HEAD
  const { t, language } = useLanguage();
=======
  const { t } = useLanguage();
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce

  const formattedBalance = useMemo(() => {
    // First convert the amount to the appropriate currency based on language
    const convertedAmount = convertCurrency(balance, language);
    // Then format the converted amount with proper currency format
    return formatCurrency(convertedAmount, language);
  }, [balance, language]);
=======
  const { language, t } = useLanguage();

  const formattedBalance = useMemo(() => {
    if (language === 'eng') {
      // For English, convert VND to USD (rough approximation)
      const usdAmount = balance / 24000; // Approximate conversion rate
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(usdAmount);
    } else {
      // For Vietnamese, use VND
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(balance).replace('₫', t('deposit.currencySymbol'));
    }
  }, [balance, language, t]);
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d

  if (!session?.user) {
    return null;
  }

  return (
    <Link
      href="/account/deposit"
      className={`group flex items-center space-x-1.5 sm:space-x-2 text-teal-600 hover:text-teal-700 transition-colors duration-300 ${className}`}
<<<<<<< HEAD
<<<<<<< HEAD
      title={t('account.balanceTooltip')}
=======
      title={t('common.balance.title')}
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
=======
      title={t('balance.tooltip')}
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
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
<<<<<<< HEAD
<<<<<<< HEAD
            <span className="text-xs sm:text-sm font-medium text-teal-600">{t('system.loading')}</span>
=======
            <span className="text-xs sm:text-sm font-medium text-teal-600">{t('common.loading')}</span>
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
=======
            <span className="text-xs sm:text-sm font-medium text-teal-600">{t('balance.loading')}</span>
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
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
