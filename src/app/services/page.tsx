'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển hướng sau 5 giây
    const redirectTimer = setTimeout(() => {
      router.replace('/products');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="py-12 flex justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-4 text-yellow-600 bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200 max-w-lg">
          <h3 className="font-bold text-lg mb-2">Thông báo chuyển hướng</h3>
          <p className="mb-2">Đường dẫn này đã thay đổi. Các dịch vụ và tài khoản hiện có thể được tìm thấy tại:</p>
          <Link href="/products" className="text-blue-600 hover:underline font-medium">/products</Link>
          <p className="mt-2 text-sm">Bạn sẽ được chuyển hướng tự động sau 5 giây...</p>
        </div>
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
