'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    
    // Ghi log thông tin để debug
    setDebugInfo(`Hash: ${hash || 'không có'}`);
    
    if (hash) {
      // Trích xuất access token từ URL hash fragment
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      setDebugInfo(prev => `${prev}\nAccess Token: ${accessToken ? 'Có (không hiển thị đầy đủ vì lý do bảo mật)' : 'Không có'}`);
      
      if (accessToken) {
        fetchUserData(accessToken);
      } else {
        setError('Không tìm thấy access token.');
        setLoading(false);
      }
    } else {
      setError('URL không chứa thông tin xác thực.');
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (accessToken: string) => {
    try {
      // Gọi Google API để lấy thông tin người dùng
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy thông tin người dùng: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
      
      // Lưu thông tin người dùng vào localStorage để sử dụng trong app
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.picture,
        provider: 'google'
      }));
      
      // Đặt trạng thái đăng nhập
      localStorage.setItem('isLoggedIn', 'true');
      
      // Sau 2 giây, chuyển hướng đến trang account
      setTimeout(() => {
        router.push('/account');
      }, 2000);
      
    } catch (error: any) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setError(`Lỗi khi lấy thông tin người dùng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Đăng nhập với Google
        </h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="mt-4 text-center text-gray-600">Đang xử lý đăng nhập...</p>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : userData ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Đăng nhập thành công!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Xin chào, {userData.name}</p>
                  <p>Email: {userData.email}</p>
                  <p className="mt-2">Đang chuyển hướng đến trang tài khoản...</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Debug information - only visible in development */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="mt-8 rounded-md bg-gray-100 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-800">Debug Information:</h3>
            <pre className="whitespace-pre-wrap text-xs text-gray-600">{debugInfo}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage; 