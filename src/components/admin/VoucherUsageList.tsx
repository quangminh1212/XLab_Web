import React from 'react';

interface VoucherUsageItem {
  email: string;
  count: number;
  index: number;
}

interface VoucherUsageListProps {
  userUsage: { [email: string]: number };
}

const VoucherUsageList: React.FC<VoucherUsageListProps> = ({ userUsage }) => {
  if (!userUsage || Object.keys(userUsage).length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="text-xs font-medium text-gray-600 mb-1">Lượt sử dụng:</div>
      <div className="max-h-32 overflow-y-auto bg-gray-50 rounded border border-gray-200 p-1">
        {Object.entries(userUsage).map(([email, count], index) => (
          <div key={email} className="flex justify-between items-center py-1 px-2 text-xs border-b border-gray-100 last:border-b-0">
            <span className="font-medium truncate max-w-[150px]">
              Người dùng #{index + 1}
            </span>
            <span className="font-bold text-gray-700">{count} lần</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherUsageList; 