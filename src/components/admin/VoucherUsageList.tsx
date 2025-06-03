import React from 'react';

interface VoucherUsageListProps {
  userUsage: { [email: string]: number };
}

const VoucherUsageList: React.FC<VoucherUsageListProps> = ({ userUsage }) => {
  if (!userUsage || Object.keys(userUsage).length === 0) {
    return null;
  }

  // Tính tổng số lần sử dụng
  const totalUsages = Object.values(userUsage).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="mt-2">
      <div className="text-xs font-medium text-gray-600">
        Tổng lượt sử dụng: <span className="font-bold text-gray-700">{totalUsages}</span>
      </div>
    </div>
  );
};

export default VoucherUsageList; 