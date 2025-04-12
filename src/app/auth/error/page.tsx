'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [oauthStatus, setOauthStatus] = useState<any>(null);

  useEffect(() => {
    // Lấy lỗi từ URL
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      setError(errorParam);
    }

    // Kiểm tra trạng thái OAuth
    const checkOauthStatus = async () => {
      try {
        const response = await fetch('/api/auth/test');
        if (response.ok) {
          const data = await response.json();
          setOauthStatus(data);
        }
      } catch (err) {
        console.error('Không thể kiểm tra trạng thái OAuth:', err);
      }
    };
    
    checkOauthStatus();
  }, [searchParams]);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'Configuration':
        return 'Có vấn đề với cấu hình NextAuth. Vui lòng kiểm tra GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET.';
      case 'AccessDenied':
        return 'Bạn đã từ chối cấp quyền truy cập.';
      case 'Verification':
        return 'Không thể xác minh email của bạn.';
      case 'OAuthSignin':
        return 'Lỗi bắt đầu quá trình đăng nhập OAuth.';
      case 'OAuthCallback':
        return 'Lỗi trong quá trình xử lý callback từ OAuth.';
      case 'OAuthCreateAccount':
        return 'Không thể tạo tài khoản OAuth.';
      case 'EmailCreateAccount':
        return 'Không thể tạo tài khoản email.';
      case 'Callback':
        return 'Lỗi xảy ra trong quá trình callback.';
      case 'OAuthAccountNotLinked':
        return 'Email đã được sử dụng với tài khoản khác.';
      case 'SessionRequired':
        return 'Bạn cần đăng nhập để truy cập trang này.';
      case 'google':
        return 'Lỗi khi đăng nhập bằng Google. Vui lòng thử lại sau.';
      default:
        return `Lỗi xác thực: ${errorCode}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-2xl">
              X
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Đã xảy ra lỗi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Chúng tôi không thể hoàn tất quá trình đăng nhập
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Lỗi xác thực
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error ? getErrorMessage(error) : 'Đã xảy ra lỗi trong quá trình xác thực.'}</p>
                </div>
              </div>
            </div>
          </div>

          {oauthStatus && (
            <div className="mb-4 p-3 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-200">
              <details>
                <summary className="cursor-pointer font-medium">Thông tin debug OAuth</summary>
                <div className="mt-2 overflow-x-auto">
                  <p className="mb-1 font-semibold">Trạng thái cấu hình:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Google Client ID: {oauthStatus.env.GOOGLE_CLIENT_ID ? 'Đã cấu hình' : 'Thiếu'}</li>
                    <li>Google Client Secret: {oauthStatus.env.GOOGLE_CLIENT_SECRET ? 'Đã cấu hình' : 'Thiếu'}</li>
                    <li>NextAuth URL: {oauthStatus.env.NEXTAUTH_URL || 'Thiếu'}</li>
                  </ul>
                  <p className="mt-2 mb-1 font-semibold">URL callback:</p>
                  <code className="block bg-gray-100 p-1 rounded text-xs font-mono overflow-auto">
                    {oauthStatus.callback_urls?.configured_callback || 'N/A'}
                  </code>
                  <p className="mt-2 text-xs">Đảm bảo URL trên được thêm vào Authorized redirect URIs trong Google Cloud Console</p>
                </div>
              </details>
            </div>
          )}

          <div className="mt-6 flex flex-col space-y-4">
            <Link href="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Quay lại trang đăng nhập
            </Link>
            
            <Link href="/" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 