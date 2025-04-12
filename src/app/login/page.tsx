'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter();
  const [currentDomain, setCurrentDomain] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  // Lấy domain hiện tại khi component được mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentDomain(window.location.origin);
    }
  }, []);

  // Hàm xử lý đăng nhập thông qua Google
  const handleGoogleSignIn = async () => {
    try {
      setLoginMessage('Đang chuyển hướng đến Google để đăng nhập...');
      console.log('Bắt đầu đăng nhập với Google...');
      console.log('Sử dụng domain:', currentDomain);
      
      // Sử dụng signIn của NextAuth để xử lý đăng nhập với Google
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true
      });
    } catch (error) {
      console.error('Lỗi khi đăng nhập với Google:', error);
      setError('Đăng nhập với Google thất bại. Vui lòng thử lại sau.');
      setLoginMessage('');
    }
  };

  // Hàm xử lý đăng nhập bằng email và mật khẩu
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Gọi API đăng nhập
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        // Chuyển hướng về trang chủ nếu đăng nhập thành công
        router.push('/');
      }
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra và hiển thị lỗi
  const getErrorMessage = (error: string) => {
    if (error.includes('redirect_uri_mismatch')) {
      return `Lỗi cấu hình đăng nhập Google: Địa chỉ callback không khớp. 
      Vui lòng thêm "${currentDomain}/api/auth/callback/google" vào danh sách Authorized redirect URIs trong Google Cloud Console.`;
    }
    return error;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản của bạn
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{getErrorMessage(error)}</span>
          </div>
        )}
        
        {loginMessage && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{loginMessage}</span>
          </div>
        )}

        {currentDomain && (
          <p className="text-sm text-gray-500 text-center">
            Hệ thống sẽ tự động sử dụng callback URL: {currentDomain}/api/auth/callback/google
          </p>
        )}
        
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đăng nhập với Google
          </button>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập bằng email</span>
            </div>
          </div>
          
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;