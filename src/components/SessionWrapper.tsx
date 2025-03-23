'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import MainHeader from '@/components/MainHeader'
import Footer from '@/components/Footer'

export default function SessionWrapper({ 
  children 
}: { 
  children: ReactNode 
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('SessionWrapper mounted');
    
    // Đánh dấu component đã được mount
    setMounted(true);
    
    // Kiểm tra xem có lỗi NextAuth không
    if (typeof window !== 'undefined') {
      const nextAuthMessage = window.sessionStorage.getItem('nextauth.message');
      console.log('NextAuth session state:', nextAuthMessage);
      
      // Log chi tiết về session storage để debug
      const allStorage = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          allStorage[key] = sessionStorage.getItem(key);
        }
      }
      console.log('All session storage:', allStorage);
    }
    
    return () => {
      console.log('SessionWrapper unmounted');
    }
  }, []);

  // Đảm bảo chỉ render SessionProvider khi đã mount để tránh lỗi hydration
  if (!mounted) {
    console.log('SessionWrapper not mounted yet, returning fallback');
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 bg-gradient-to-r from-primary-50 to-secondary-50"></div>
        <main id="main-content" className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  try {
    console.log('Rendering SessionProvider');
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