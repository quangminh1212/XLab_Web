'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Nếu đã đăng nhập, chuyển hướng đến callbackUrl
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setIsLoading(false);
    }
  };

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-2xl">
            !
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Đăng nhập không thành công
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Có lỗi xảy ra khi đăng nhập: {error === 'google' ? 'Không thể kết nối với Google' : error}
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSignIn}
              className="px-5 py-2 border border-teal-500 text-teal-600 rounded-full hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center"
            >
              Thử lại
            </button>
            <Link
              href="/"
              className="ml-4 px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị trang đăng nhập
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập để truy cập vào trang quản trị
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignIn}
            disabled={isLoading || status === 'loading'}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 relative"
          >
            {(isLoading || status === 'loading') && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                <div className="w-5 h-5 border-2 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-teal-600 hover:text-teal-500"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 