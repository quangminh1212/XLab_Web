import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

'use client';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'Configuration':
        return 'Có lỗi trong cấu hình máy chủ. Vui lòng thử lại sau.';
      case 'AccessDenied':
        return 'Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.';
      case 'Verification':
        return 'Không thể xác thực email của bạn. Vui lòng thử lại.';
      case 'OAuthSignin':
        return 'Lỗi khi bắt đầu phiên đăng nhập OAuth. Vui lòng thử lại.';
      case 'OAuthCallback':
        return 'Lỗi trong quá trình xử lý OAuth. Vui lòng thử lại.';
      case 'OAuthCreateAccount':
        return 'Không thể tạo tài khoản người dùng. Vui lòng thử lại sau.';
      case 'EmailCreateAccount':
        return 'Không thể tạo tài khoản bằng email. Vui lòng thử phương thức khác.';
      case 'Callback':
        return 'Lỗi xử lý xác thực. Vui lòng thử lại sau.';
      case 'OAuthAccountNotLinked':
        return 'Email đã được sử dụng với nhà cung cấp khác. Vui lòng đăng nhập bằng nhà cung cấp ban đầu.';
      case 'EmailSignin':
        return 'Lỗi gửi email. Vui lòng thử lại sau.';
      case 'CredentialsSignin':
        return 'Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại thông tin và thử lại.';
      case 'SessionRequired':
        return 'Yêu cầu đăng nhập để truy cập trang này.';
      default:
        return 'Đã xảy ra lỗi không xác định trong quá trình xác thực. Vui lòng thử lại.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-red-100 flex items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
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
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900 mb-3">Lỗi xác thực</h2>

          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{getErrorMessage(error)}</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Bạn có thể thử lại việc đăng nhập hoặc quay lại trang chủ.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Thử lại
              </Link>
              <Link
                href="/"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Trang chủ
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Nếu bạn vẫn gặp vấn đề, vui lòng{' '}
            <Link href="/contact" className="font-medium text-primary-600 hover:text-primary-500">
              liên hệ hỗ trợ
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
