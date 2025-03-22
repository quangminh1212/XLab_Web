'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle traditional login (would connect to a backend)
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/account' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <h1 className="text-2xl font-bold text-primary-600">XLab</h1>
              </Link>
              <h2 className="text-xl font-bold mt-6 mb-2">Đăng nhập vào tài khoản</h2>
              <p className="text-gray-600">Truy cập phần mềm và dịch vụ của XLab</p>
            </div>

            <div className="space-y-4">
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                disabled={isLoading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                <span>Đăng nhập bằng Google</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>

              {/* Traditional Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu
                    </label>
                    <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div className="flex items-center mb-4">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-center text-gray-600">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 