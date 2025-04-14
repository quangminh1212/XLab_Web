'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case 'Configuration':
      return 'Có lỗi cấu hình máy chủ. Vui lòng liên hệ quản trị viên.';
    case 'AccessDenied':
      return 'Bạn không có quyền truy cập vào tài nguyên này.';
    case 'Verification':
      return 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.';
    case 'OAuthSignin':
      return 'Lỗi khi khởi tạo đăng nhập OAuth.';
    case 'OAuthCallback':
      return 'Lỗi khi nhận phản hồi từ nhà cung cấp OAuth.';
    case 'OAuthCreateAccount':
      return 'Không thể tạo tài khoản từ nhà cung cấp OAuth.';
    case 'EmailCreateAccount':
      return 'Không thể tạo tài khoản bằng email.';
    case 'Callback':
      return 'Lỗi trong quá trình xử lý phản hồi xác thực.';
    case 'OAuthAccountNotLinked':
      return 'Email đã được sử dụng với một tài khoản khác.';
    case 'EmailSignin':
      return 'Lỗi khi gửi email đăng nhập.';
    case 'CredentialsSignin':
      return 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.';
    case 'SessionRequired':
      return 'Yêu cầu đăng nhập để truy cập tài nguyên này.';
    case 'Default':
    default:
      return 'Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.';
  }
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!error) {
      // Nếu không có lỗi, chuyển về trang chủ sau 1 giây
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }

    // Đếm ngược để chuyển về trang chủ
    const countdownTimer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownTimer);
          router.push('/');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [router, error]);

  if (!error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-2xl">
            !
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Đang chuyển hướng
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Không có thông tin lỗi. Đang quay lại trang chủ...
          </p>
          <div className="mt-4">
            <div className="w-12 h-12 mx-auto rounded-full border-t-2 border-b-2 border-teal-500 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Lỗi xác thực
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Mã lỗi: {error}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-sm text-center text-gray-500">
            Tự động chuyển về trang chủ sau {timeLeft} giây
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/login" className="px-4 py-2 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 transition-colors">
              Thử đăng nhập lại
            </Link>
            <Link href="/" className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 