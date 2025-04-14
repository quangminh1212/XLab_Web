'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Log debug information
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    const debug = `
      Status: ${status}
      Session: ${session ? 'Available' : 'Not available'}
      Params: ${params.toString()}
    `;
    
    setDebugInfo(debug);

    // Handle authentication
    if (status === 'authenticated' && session) {
      console.log('Authenticated with NextAuth:', session);
      
      // Store session data in localStorage for compatibility with manual OAuth
      localStorage.setItem('user', JSON.stringify({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || '',
        provider: 'google',
        accessToken: '',
      }));

      // Redirect to account page
      setTimeout(() => {
        router.push('/account');
      }, 1000);
    } else if (status === 'unauthenticated') {
      console.log('Authentication failed');
    }
  }, [session, status, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {status === 'authenticated' 
                ? 'Đăng nhập thành công!' 
                : status === 'loading' 
                  ? 'Đang xác thực...' 
                  : 'Đăng nhập thất bại!'}
            </h2>
          </div>

          {status === 'loading' && (
            <div className="flex justify-center my-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          )}

          {status === 'authenticated' && (
            <div className="text-center text-green-600 mb-4">
              <p>Chào mừng {session?.user?.name}!</p>
              <p className="mt-2">Đang chuyển hướng đến trang tài khoản...</p>
            </div>
          )}

          {status === 'unauthenticated' && (
            <div className="text-center text-red-600 mb-4">
              <p>Đăng nhập không thành công. Vui lòng thử lại.</p>
              <div className="mt-4">
                <Link 
                  href="/login"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}

          {/* Debug information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-sm font-medium text-gray-700">Debug Info:</h3>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-40">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 