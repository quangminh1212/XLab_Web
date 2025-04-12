'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfileTestPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Thử đọc cookie từ document.cookie
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }

    try {
      // Lấy cookie user-session
      const userSessionCookie = getCookie('user-session');
      
      if (userSessionCookie) {
        try {
          // Giải mã cookie từ base64
          const decodedCookie = atob(userSessionCookie);
          const userData = JSON.parse(decodedCookie);
          setUserData(userData);
          setLoading(false);
        } catch (e) {
          console.error('Lỗi giải mã cookie:', e);
          setError('Không thể giải mã thông tin đăng nhập');
          setLoading(false);
        }
      } else {
        setError('Không tìm thấy cookie đăng nhập');
        setLoading(false);
      }
    } catch (err) {
      console.error('Lỗi khi kiểm tra đăng nhập:', err);
      setError('Có lỗi xảy ra khi kiểm tra trạng thái đăng nhập');
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kiểm tra trạng thái đăng nhập</h1>
          <p className="mt-2 text-sm text-gray-600">
            Trang này kiểm tra xem bạn đã đăng nhập thành công chưa
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p className="font-medium mb-2">Lỗi</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-md text-teal-700">
              <p className="font-medium mb-2">Đã đăng nhập thành công!</p>
            </div>

            {userData?.user?.picture && (
              <div className="flex justify-center mb-4">
                <img
                  src={userData.user.picture}
                  alt={userData.user.name || 'Ảnh đại diện'}
                  className="h-20 w-20 rounded-full"
                />
              </div>
            )}

            <div className="border rounded-md p-4 bg-gray-50">
              <h2 className="text-lg font-medium mb-3">Thông tin người dùng:</h2>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
          >
            Về trang chủ
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
} 