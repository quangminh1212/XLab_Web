'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Nếu có lỗi thì không chuyển hướng tự động
    if (error) return;

    // Đặt timeout 5 giây - nếu chuyển hướng ko thành công 
    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);

    // Chuyển hướng người dùng đến trang đích
    router.push(callbackUrl);

    return () => clearTimeout(timeoutId);
  }, [router, callbackUrl, error]);

  const handleManualSignIn = () => {
    signIn('google', { callbackUrl });
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
              onClick={handleManualSignIn}
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
          X
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
          Đang chuyển hướng...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vui lòng đợi trong giây lát
        </p>
        <div className="mt-4">
          <div className="w-12 h-12 mx-auto rounded-full border-t-2 border-b-2 border-teal-500 animate-spin"></div>
        </div>

        {timeoutReached && (
          <div className="mt-8 space-y-4">
            <p className="text-amber-600">
              Đã quá thời gian chờ. Có thể có vấn đề với quá trình đăng nhập.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleManualSignIn}
                className="px-5 py-2 border border-teal-500 text-teal-600 rounded-full hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center"
              >
                Đăng nhập thủ công
              </button>
              <Link
                href="/"
                className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 