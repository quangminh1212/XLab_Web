'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const errorType = searchParams?.get('error');
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { data: session, status } = useSession();

  // Thêm timeout ngắn hơn để tránh trường hợp loading vô hạn
  useEffect(() => {
    console.log("Session status:", status);
    
    // Đặt timeout ngắn hơn
    const timeoutId = setTimeout(() => {
      if (checkingAuth) {
        console.log('Session check timeout, showing login form anyway');
        setCheckingAuth(false);
      }
    }, 1500); // Giảm xuống 1.5 giây

    // Kiểm tra auth status
    if (status === 'authenticated') {
      console.log('User already authenticated, redirecting to:', callbackUrl);
      router.push(callbackUrl);
    } else if (status === 'unauthenticated') {
      console.log('User not authenticated, showing login form');
      setCheckingAuth(false);
    }

    return () => clearTimeout(timeoutId);
  }, [status, callbackUrl, router, checkingAuth]);

  useEffect(() => {
    // Xử lý lỗi từ URL nếu có
    if (errorType) {
      setCheckingAuth(false);
      switch (errorType) {
        case 'google':
          setError('Có lỗi khi đăng nhập với Google. Vui lòng kiểm tra cấu hình hoặc thử lại sau.');
          break;
        case 'Callback':
          setError('Lỗi xác thực callback. Vui lòng kiểm tra cấu hình URI chuyển hướng.');
          break;
        case 'OAuthCallback':
          setError('Lỗi xác thực OAuth. Vui lòng kiểm tra cấu hình client ID và secret.');
          break;
        case 'AccessDenied':
          setError('Quyền truy cập bị từ chối.');
          break;
        default:
          setError(`Lỗi xác thực: ${errorType}`);
          break;
      }
    }
  }, [errorType]);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      
      await signIn('google', { 
        callbackUrl,
        redirect: true
      });
      
      // Lưu ý: Không cần xử lý chuyển hướng ở đây vì signIn với redirect: true sẽ tự động chuyển hướng
    } catch (err) {
      console.error('Lỗi đăng nhập Google:', err);
      setError('Có lỗi xảy ra khi đăng nhập với Google. Vui lòng thử lại.');
      setGoogleLoading(false);
    }
  };

  // Nếu đã xác nhận đăng nhập thành công và đang chuyển hướng
  if (status === 'authenticated' && !checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="mt-4 text-gray-600">Đăng nhập thành công, đang chuyển hướng...</p>
      </div>
    );
  }

  // Thêm một URL dự phòng để sử dụng trong trường hợp signIn không hoạt động
  const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth?client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgoogle&response_type=code&scope=openid%20email%20profile&prompt=select_account&access_type=offline";

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
            Chào mừng trở lại!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 max-w">
            Đăng nhập để tiếp tục sử dụng các dịch vụ của XLab
          </p>
          {checkingAuth && status === 'loading' && (
            <div className="mt-2 text-sm text-center text-gray-500 flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500 mr-2"></div>
              <span>Đang kiểm tra phiên đăng nhập...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 mb-6">
            <a
              href={googleOAuthURL}
              onClick={(e) => {
                e.preventDefault();
                handleGoogleLogin();
              }}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 relative transition duration-150 cursor-pointer"
            >
              {googleLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 text-teal-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  <span>Tiếp tục với Google</span>
                </>
              )}
            </a>
            
            {/* Thêm liên kết dự phòng nếu nút không hoạt động */}
            <div className="text-xs text-center mt-1 text-gray-500">
              <span>Nếu nút không hoạt động, </span>
              <a href={googleOAuthURL} className="text-teal-600 hover:underline">nhấp vào đây</a>
            </div>
          </div>

        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <Link href="/terms" className="text-teal-600 hover:underline">Điều khoản dịch vụ</Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-teal-600 hover:underline">Chính sách bảo mật</Link>{' '}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
} 