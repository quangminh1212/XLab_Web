'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const error = searchParams?.get('error');
    
    if (error) {
      switch(error) {
        case 'OAuthAccountNotLinked':
          setErrorMessage('Email này đã được sử dụng với phương thức đăng nhập khác.');
          break;
        case 'AccessDenied':
          setErrorMessage('Quyền truy cập bị từ chối.');
          break;
        case 'Verification':
          setErrorMessage('Liên kết xác thực đã hết hạn hoặc đã được sử dụng.');
          break;
        case 'Configuration':
          setErrorMessage('Lỗi cấu hình máy chủ. Vui lòng thử lại sau.');
          break;
        case 'EmailSignin':
          setErrorMessage('Không thể gửi email đăng nhập. Vui lòng thử lại sau.');
          break;
        default:
          setErrorMessage('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
      }
    } else {
      setErrorMessage('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
    }
  }, [searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
              X
            </div>
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Lỗi xác thực
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            <div className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col space-y-4">
            <Link 
              href="/login"
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Quay lại trang đăng nhập
            </Link>
            
            <Link 
              href="/"
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 