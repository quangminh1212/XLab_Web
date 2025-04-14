'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const error = searchParams?.get('error');
    
    if (error) {
      console.error('Lỗi xác thực:', error);
      router.push(`/login?error=${error}`);
      return;
    }
    
    // Đã xác thực thành công, chuyển hướng về trang chủ hoặc trang được yêu cầu
    const callbackUrl = searchParams?.get('callbackUrl') || '/';
    router.push(callbackUrl);
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Đang xử lý đăng nhập...</h2>
        <p className="mt-2 text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
} 