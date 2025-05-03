'use client';

import React from 'react';
import Link from 'next/link';

const TopNav: React.FC = () => {
  return (
    <nav className="bg-primary-600 text-white py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link href="/contact" className="text-xs hover:underline">
            Liên hệ
          </Link>
          <Link href="/support" className="text-xs hover:underline">
            Hỗ trợ kỹ thuật
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="text-xs hover:underline">
            Đăng nhập
          </Link>
          <Link href="/register" className="text-xs hover:underline">
            Đăng ký
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default TopNav; 