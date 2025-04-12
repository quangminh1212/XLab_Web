'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestLoginPage() {
  const [origin, setOrigin] = useState('');
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Đánh dấu đã render trên client
    setIsClient(true);
    
    // Thiết lập origin khi trang được tải
    const currentOrigin = window.location.origin;
    setOrigin(currentOrigin);
    
    // Tạo URL đăng nhập Google
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
      currentOrigin + "/api/auth/callback/google"
    )}&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;
    
    setGoogleAuthUrl(authUrl);
  }, []);

  // Hiển thị nội dung trống khi ở server hoặc hydration đầu tiên
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Trang đăng nhập thử nghiệm
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vui lòng sử dụng một trong các phương thức đăng nhập dưới đây
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col gap-4">
            <a 
              href={googleAuthUrl}
              className="flex items-center justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              Đăng nhập với Google (Link trực tiếp)
            </a>

            <a 
              href="/api/auth/google"
              className="flex items-center justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Đăng nhập với Google (Qua API)
            </a>

            <button
              onClick={() => {
                window.location.href = googleAuthUrl;
              }}
              className="flex items-center justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              Đăng nhập với Google (JS Click)
            </button>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                Quay lại trang đăng nhập chính
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 