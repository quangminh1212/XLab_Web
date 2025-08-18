import React from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

interface NewUserVoucherCardProps {
  minAmount: number;
  usedCount: number;
  maxUsage: number;
}

export default function NewUserVoucherCard({
  minAmount,
  usedCount,
  maxUsage,
}: NewUserVoucherCardProps) {
  const { t } = useLanguage();
  const usagePercentage = (usedCount / maxUsage) * 100;

  return (
    <div className="bg-teal-50 rounded-lg p-4 mb-4">
      <h3 className="text-teal-800 font-medium mb-3">{t('discountCodes.specialDiscountDesc')}</h3>

      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-teal-600 font-medium">{t('discountCodes.remaining')} {maxUsage - usedCount}</span>
        <span className="text-gray-500">{usagePercentage.toFixed(0)}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
          style={{ width: `${usagePercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
