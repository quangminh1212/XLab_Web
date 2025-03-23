'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'
import MainHeader from '@/components/MainHeader'
import Footer from '@/components/Footer'

/**
 * SessionWrapper component wraps the application with NextAuth SessionProvider
 * Được cập nhật để tương thích với Next.js 15
 */
export default function SessionWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    console.log('[SessionWrapper] Component mounted')
    
    // Đảm bảo localStorage có thể truy cập (bảo vệ cho môi trường SSR)
    try {
      const theme = localStorage.getItem('theme')
      console.log('[SessionWrapper] Theme from localStorage:', theme || 'not set')
    } catch (error) {
      console.error('[SessionWrapper] Error accessing localStorage:', error)
    }
  }, [])

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
} 