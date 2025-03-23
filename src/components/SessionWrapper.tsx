'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import Footer from '@/components/Footer'

type SessionWrapperProps = {
  children: React.ReactNode
}

/**
 * SessionWrapper component wraps the application with NextAuth SessionProvider
 * and provides error handling + debugging
 */
export default function SessionWrapper({ children }: SessionWrapperProps) {
  useEffect(() => {
    console.log('[SessionWrapper] Mounted')
    
    // Kiểm tra localStorage để debug
    try {
      const sessionItems = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.includes('session') || key && key.includes('next-auth')) {
          sessionItems.push({ key, value: localStorage.getItem(key) })
        }
      }
      console.log('[SessionWrapper] Storage Items:', sessionItems)
    } catch (error) {
      console.warn('[SessionWrapper] Could not access localStorage:', error)
    }
    
    return () => {
      console.log('[SessionWrapper] Unmounted')
    }
  }, [])

  try {
    // Bọc ứng dụng với SessionProvider từ NextAuth
    return (
      <SessionProvider 
        refetchInterval={5 * 60} // Refresh session every 5 minutes
        refetchOnWindowFocus={true} 
      >
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
    // Xử lý lỗi khi SessionProvider không thể render
    console.error('[SessionWrapper] Error rendering SessionProvider:', error)
    
    // Fallback UI khi SessionProvider fails
    return (
      <div className="min-h-screen flex flex-col">
        <div className="p-4 bg-yellow-50 text-yellow-700 text-sm">
          Không thể khởi tạo phiên đăng nhập. Vui lòng tải lại trang.
        </div>
        <main id="main-content" className="flex-grow">
          {children}
        </main>
      </div>
    )
  }
} 