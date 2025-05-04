'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SignInWithGoogle() {
  useEffect(() => {
    // Thử mở URL đăng nhập Google trực tiếp khi trang được tải
    const googleSignInUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com&' +
      'redirect_uri=http://localhost:3000/api/auth/callback/google&' +
      'response_type=code&' +
      'scope=openid%20email%20profile&' +
      'prompt=select_account';

    window.location.href = googleSignInUrl;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Đang chuyển hướng đến Google...</h1>
        <p className="text-gray-600 mb-4 text-center">
          Nếu bạn không được chuyển hướng tự động, vui lòng nhấn vào nút bên dưới.
        </p>
        <Link 
          href="https://accounts.google.com/o/oauth2/v2/auth?client_id=909905227025-qtk1u8jr6qj93qg9hu99qfrh27rtd2np.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/auth/callback/google&response_type=code&scope=openid%20email%20profile&prompt=select_account"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Đăng nhập với Google
        </Link>
      </div>
    </div>
  );
} 