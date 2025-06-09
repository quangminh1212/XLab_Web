'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);

    if (status === 'authenticated' && session) {
      console.log('User is authenticated, redirecting to homepage');
      router.replace('/');
    }
  }, [session, status, router]);

  const handleGoogleSignIn = () => {
    setLoading(true);
    console.log('Redirecting to Google sign in');
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white relative">
      {/* Đường trang trí tối giản */}
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400"></div>
      
      <div className="w-full max-w-md px-8 py-12">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6 transition-transform hover:scale-105">
            <Image
              src="/images/logo.jpg"
              alt="XLab Logo"
              width={120}
              height={48}
              priority
              className="h-14 w-auto"
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Chào mừng trở lại!</h2>
          <p className="mt-2 text-gray-600">
            Đăng nhập để tiếp tục sử dụng các dịch vụ của XLab
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 flex items-start">
              <svg
                className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <p className="text-center text-gray-600 mb-6">
            Đăng nhập an toàn với tài khoản Google
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-base font-medium text-white bg-primary-500 hover:bg-primary-600 transition-all duration-200 shadow-sm"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none">
                <path
                  fill="#fff"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            )}
            <span>Tiếp tục với Google</span>
          </button>
          
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500 inline-flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Đăng nhập an toàn 100%
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Điều khoản dịch vụ
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Chính sách bảo mật
            </Link>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
