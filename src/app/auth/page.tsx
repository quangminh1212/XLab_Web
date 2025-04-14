'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Log để debug
    setDebugInfo('=== NextAuth Callback Page ===');
    setDebugInfo(prev => prev + `\nThời gian: ${new Date().toISOString()}`);
    setDebugInfo(prev => prev + `\nSession status: ${status}`);
    setDebugInfo(prev => prev + `\nSession: ${session ? 'Có' : 'Không có'}`);
    
    // Lấy các tham số tìm kiếm một cách an toàn
    const params: Record<string, string> = {};
    if (searchParams) {
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      setDebugInfo(prev => prev + `\nSearch params: ${JSON.stringify(params)}`);
    }

    // Xử lý trạng thái xác thực
    if (status === 'authenticated' && session) {
      setDebugInfo(prev => prev + '\nĐã xác thực thành công, chuyển hướng đến trang account');
      
      // Lưu thông tin session vào localStorage để tương thích với OAuth thủ công
      try {
        if (session.user) {
          localStorage.setItem('user_profile', JSON.stringify(session.user));
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('auth_method', 'nextauth');
          localStorage.setItem('login_time', new Date().toISOString());
          setDebugInfo(prev => prev + '\nĐã lưu thông tin người dùng vào localStorage');
        }
      } catch (error) {
        console.error('Lỗi khi lưu thông tin người dùng:', error);
      }
      
      // Chuyển hướng đến trang account sau 1 giây
      setTimeout(() => {
        router.push('/account');
      }, 1000);
    } else if (status === 'unauthenticated') {
      setDebugInfo(prev => prev + '\nXác thực thất bại, chuyển hướng về trang đăng nhập');
      router.push('/login?error=AuthenticationFailed');
    } else {
      setDebugInfo(prev => prev + `\nĐang chờ kết quả xác thực... (${status})`);
    }
  }, [status, session, router, searchParams]);

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
          <p className="text-gray-700 mb-2">Đang xác thực thông tin từ Google</p>
          <p className="text-sm text-gray-500">Trạng thái: {status}</p>
        </div>
        
        {/* Debug Information */}
        <div className="mt-8 p-3 bg-gray-100 rounded text-left">
          <details>
            <summary className="text-sm font-medium cursor-pointer">Thông tin debug</summary>
            <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-60 p-2 bg-gray-50 rounded">{debugInfo}</pre>
          </details>
        </div>
      </div>
    </div>
  );
} 