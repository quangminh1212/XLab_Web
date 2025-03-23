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
 * Được cập nhật để tương thích với Next.js 15
 */
export default function SessionWrapper({ children }: SessionWrapperProps) {
  useEffect(() => {
    console.log('[SessionWrapper] Component mounted')
    
    return () => {
      console.log('[SessionWrapper] Component unmounted')
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