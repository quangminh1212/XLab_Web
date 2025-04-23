'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function LoginDebug() {
  const { data: session, status } = useSession();
  const [showDebug, setShowDebug] = useState(false);
  const [hasCookies, setHasCookies] = useState(false);
  
  useEffect(() => {
    // Kiểm tra cookies
    const cookies = document.cookie;
    const hasNextAuthCookie = cookies.includes('next-auth');
    setHasCookies(hasNextAuthCookie);
    
    // Log trạng thái
    console.log('LoginDebug - Session status:', status);
    console.log('LoginDebug - Session data:', session);
    console.log('LoginDebug - Has NextAuth cookie:', hasNextAuthCookie);
    console.log('LoginDebug - Cookies:', cookies);
  }, [session, status]);
  
  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-full p-2 shadow-lg z-50 opacity-30 hover:opacity-100 transition-opacity"
        title="Debug đăng nhập"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }
  
  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="flex justify-between mb-3">
        <h3 className="font-bold text-lg">Debug Đăng Nhập</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border rounded p-3">
          <h4 className="font-semibold mb-2">Trạng thái đăng nhập</h4>
          <div className="text-sm">
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 ${
                status === 'authenticated' ? 'text-green-600' : 
                status === 'loading' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {status === 'authenticated' ? 'Đã đăng nhập' : 
                 status === 'loading' ? 'Đang tải...' : 'Chưa đăng nhập'}
              </span>
            </p>
            <p><span className="font-medium">Session:</span> {session ? 'Có' : 'Không có'}</p>
            <p><span className="font-medium">Người dùng:</span> {session?.user?.name || 'N/A'}</p>
            <p><span className="font-medium">Email:</span> {session?.user?.email || 'N/A'}</p>
            <p><span className="font-medium">Cookies NextAuth:</span> {hasCookies ? 'Có' : 'Không có'}</p>
          </div>
        </div>
        
        <div className="border rounded p-3">
          <h4 className="font-semibold mb-2">Hành động</h4>
          <div className="space-y-2">
            <button
              onClick={() => signIn(undefined, { callbackUrl: '/account' })}
              className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 w-full"
            >
              Đăng nhập thủ công
            </button>
            <button
              onClick={() => {
                document.cookie.split(";").forEach((c) => {
                  document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                window.location.reload();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Xóa tất cả cookies
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      </div>
      
      <div className="border rounded p-3 bg-gray-50">
        <h4 className="font-semibold mb-2">Chi tiết session</h4>
        <pre className="text-xs overflow-auto max-h-36">
          {JSON.stringify(session, null, 2) || 'Không có dữ liệu session'}
        </pre>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Mở DevTools (F12) để xem logs chi tiết</p>
      </div>
    </div>
  );
} 