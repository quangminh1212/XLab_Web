'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log để debug
    console.log('Auth callback page loaded');
    console.log('Session status:', status);
    console.log('Session data:', session);
    
    // Lấy các tham số tìm kiếm một cách an toàn
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    console.log('Search params:', params);

    // Khi đã đăng nhập thành công, chuyển hướng về trang chủ hoặc trang tài khoản
    if (status === 'authenticated' && session) {
      console.log('Authenticated, redirecting to account page');
      router.push('/account');
    }
    // Khi đăng nhập thất bại hoặc cancel, chuyển về trang login
    else if (status === 'unauthenticated') {
      console.log('Authentication failed, redirecting to login page');
      router.push('/login?error=AuthenticationFailed');
    }
    // Nếu đang loading, không làm gì cả
  }, [status, session, router, searchParams]);

  // Màn hình loading trong khi chờ xử lý
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4">
            X
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý đăng nhập...</h1>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Chúng tôi đang xác thực thông tin từ Google</p>
        </div>
      </div>
    </div>
  );
} 