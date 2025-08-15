'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import withAdminAuth from '@/components/withAdminAuth';

function AdminProductRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct products page
    router.replace('/admin/products');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold">Đang chuyển hướng...</h1>
        <p className="text-gray-500">Đang chuyển bạn đến trang quản lý sản phẩm</p>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminProductRedirectPage);
