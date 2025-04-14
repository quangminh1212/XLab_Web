'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { Toaster, toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';

// Định nghĩa schema validation cho form đăng nhập
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Xử lý lỗi từ URL nếu có
  useEffect(() => {
    const error = searchParams?.get('error');
    if (error) {
      const errorMessages: {[key: string]: string} = {
        'AuthenticationFailed': 'Xác thực không thành công',
        'OAuthAccountNotLinked': 'Tài khoản Google này chưa được liên kết',
        'OAuthCallback': 'Lỗi khi xử lý đăng nhập từ Google',
        'default': 'Đăng nhập không thành công'
      };
      toast.error(errorMessages[error] || errorMessages.default);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Xử lý đăng nhập bằng NextAuth
  const handleNextAuthLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/account',
        redirect: true
      });
      
      if (!result) {
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập qua NextAuth:', error);
      toast.error('Đăng nhập bằng Google không thành công');
      setIsGoogleLoading(false);
    }
  };

  // Xử lý đăng nhập email/password
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', data);
      
      if (response.data.success) {
        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_profile', JSON.stringify(response.data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        toast.success('Đăng nhập thành công!');
        
        // Chuyển hướng đến trang chính sau khi đăng nhập
        setTimeout(() => {
          router.push('/account');
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý đăng nhập bằng Google OAuth2 thủ công
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    
    try {
      // Thiết lập các tham số cho OAuth2
      const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
        `${window.location.origin}/google-callback`;
      const scope = 'email profile';
      const response_type = 'token';
      
      if (!client_id) {
        toast.error('Thiếu cấu hình Google Client ID');
        setIsGoogleLoading(false);
        return;
      }

      // Tạo URL đăng nhập Google OAuth2
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const queryParams = new URLSearchParams({
        client_id,
        redirect_uri,
        response_type,
        scope,
        include_granted_scopes: 'true',
        state: 'pass-through-value'
      });

      // Chuyển hướng đến trang đăng nhập Google
      window.location.href = `${googleAuthUrl}?${queryParams.toString()}`;
    } catch (error) {
      console.error('Lỗi khi khởi tạo đăng nhập Google:', error);
      toast.error('Không thể kết nối với Google');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link
              href="/register"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm`}
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Mật khẩu"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm`}
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
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
                'Đăng nhập'
              )}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
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
                  <>
                    <svg 
                      className="w-5 h-5 mr-2" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                        fill="#4285F4" 
                      />
                      <path 
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                        fill="#34A853" 
                      />
                      <path 
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                        fill="#FBBC05" 
                      />
                      <path 
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                        fill="#EA4335" 
                      />
                    </svg>
                    Đăng nhập với Google
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
} 