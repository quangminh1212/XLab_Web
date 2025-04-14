'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GoogleCallback() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Lấy access token từ hash fragment trong URL
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get('access_token');

        if (!accessToken) {
          setError('Không tìm thấy access token');
          setLoading(false);
          return;
        }

        // Gọi API của Google để lấy thông tin người dùng
        const response = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Không thể lấy thông tin người dùng từ Google');
        }

        const data = await response.json();
        setUserData(data);

        // Lưu thông tin người dùng vào localStorage hoặc sessionStorage
        localStorage.setItem('user_profile', JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          picture: data.picture,
        }));
        
        // Lưu token để có thể sử dụng cho các API khác
        localStorage.setItem('google_access_token', accessToken);
        localStorage.setItem('isLoggedIn', 'true');

        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          router.push('/account');
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi xử lý đăng nhập Google');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
        {loading && (
          <div className="my-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang xử lý đăng nhập...</p>
          </div>
        )}

        {error && (
          <div className="my-8">
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Quay lại trang đăng nhập
            </button>
          </div>
        )}

        {userData && (
          <div className="my-8">
            <div className="flex justify-center mb-4">
              {userData.picture && (
                <Image
                  src={userData.picture}
                  alt={userData.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Xin chào, {userData.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              Đăng nhập thành công, bạn sẽ được chuyển hướng tự động...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 