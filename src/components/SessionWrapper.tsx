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
 * Cập nhật để tương thích với phiên bản Next.js 14.2.4
 */
export default function SessionWrapper({ children }: SessionWrapperProps) {
  useEffect(() => {
    console.log('[SessionWrapper] Component mounted')
    
    // Debug localStorage
    try {
      const sessionItems = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('session') || key.includes('next-auth'))) {
          sessionItems.push({ key, value: localStorage.getItem(key) })
        }
      }
      if (sessionItems.length > 0) {
        console.log('[SessionWrapper] Found SessionStorage items:', sessionItems)
      }
    } catch (error) {
      console.warn('[SessionWrapper] Could not access localStorage:', error)
    }
    
    return () => {
      console.log('[SessionWrapper] Component unmounted')
    }
  }, [])

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
} 