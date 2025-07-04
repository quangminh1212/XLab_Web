import Image from 'next/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

'use client';



export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 via-white to-gray-50 relative overflow-hidden">
      {/* Các phần tử trang trí nền */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center group">
            <div className="relative overflow-hidden rounded-lg transition-all duration-300 transform group-hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="XLab Logo"
                width={150}
                height={60}
                priority
                className="h-16 w-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">{t('login.welcome')}</h2>
          <p className="mt-3 text-center text-lg text-gray-600 max-w-md mx-auto">
            {t('login.continue')}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100 relative backdrop-filter backdrop-blur-sm bg-opacity-90">
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

          <div className="space-y-5">
            <p className="text-center text-gray-600 mb-4">
              {t('login.connect')}
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500"
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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              )}
              <span>{t('login.google')}</span>
            </button>
          </div>

          {/* Phần thông tin bổ sung */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span>{t('login.secure')}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t('login.terms')}{' '}
            <Link href="/terms" className="text-primary-600 hover:underline font-medium">
              {t('login.termsLink')}
            </Link>{' '}
            {t('login.and')}{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline font-medium">
              {t('login.privacyLink')}
            </Link>{' '}
            {t('login.ourCompany')}
          </p>
        </div>
      </div>
    </div>
  );
}
