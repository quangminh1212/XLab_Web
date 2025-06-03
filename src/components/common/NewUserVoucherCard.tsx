import React from 'react';

interface NewUserVoucherCardProps {
  minAmount: number;
  usedCount: number;
  maxUsage: number;
}

export default function NewUserVoucherCard({ minAmount, usedCount, maxUsage }: NewUserVoucherCardProps) {
  const usagePercentage = (usedCount / maxUsage) * 100;

  return (
    <div className="bg-teal-50 rounded-lg p-4 mb-4">
      <h3 className="text-teal-800 font-medium mb-3">Ưu đãi dành cho khách hàng đăng ký mới</h3>
      
      <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5">
        <span>Đơn tối thiểu: {minAmount.toLocaleString()} đ | Còn {maxUsage - usedCount} lượt</span>
        <span>{usagePercentage.toFixed(0)}%</span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
          style={{ width: `${usagePercentage}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-2">
        Nhấn vào mã để sao chép
      </div>
    </div>
  );
} 