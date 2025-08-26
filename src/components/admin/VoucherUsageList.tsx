import React from 'react';

interface VoucherUsageListProps {
  userUsage: { [email: string]: number };
}

const VoucherUsageList: React.FC<VoucherUsageListProps> = ({ userUsage: _userUsage }) => {
  // Component không hiển thị gì cả
  return null;
};

export default VoucherUsageList;
