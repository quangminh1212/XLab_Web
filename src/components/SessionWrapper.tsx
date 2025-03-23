'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import Footer from '@/components/Footer'

export default function SessionWrapper({ 
  children 
}: { 
  children: ReactNode 
}) {
  useEffect(() => {
    console.log('SessionWrapper mounted');
    
    // Kiểm tra xem có lỗi NextAuth không
    if (typeof window !== 'undefined') {
      console.log('NextAuth session state:', window.sessionStorage.getItem('nextauth.message'));
    }
    
    return () => {
      console.log('SessionWrapper unmounted');
    }
  }, []);

  try {
    return (
      <SessionProvider>
        <div className="flex flex-col min-h-screen">
          <MainHeader />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary-500 focus:text-white focus:z-50">
            Bỏ qua phần điều hướng
          </a>
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </SessionProvider>
    )
  } catch (error) {
    console.error('Error in SessionWrapper:', error);
    return (
      <div className="flex flex-col min-h-screen">
        <div className="p-4 bg-red-50 border border-red-200 rounded m-4">
          <h2 className="text-lg font-semibold text-red-700">Lỗi khi khởi tạo phiên đăng nhập</h2>
          <p className="mt-2 text-red-600">{error instanceof Error ? error.message : 'Lỗi không xác định'}</p>
        </div>
        <main id="main-content" className="flex-grow">
          {children}
        </main>
      </div>
    )
  }
} 