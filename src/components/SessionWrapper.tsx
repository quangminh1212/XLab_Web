'use client'

import { SessionProvider } from 'next-auth/react'
import { memo, useEffect } from 'react'

/**
 * SessionWrapper component wraps the application with NextAuth SessionProvider
 * Được tối ưu với memo để ngăn re-render không cần thiết
 * Tương thích với Next.js 15+
 */
const SessionWrapper = memo(function SessionWrapper({ children }: { children: React.ReactNode }) {
  // Chỉ log trong môi trường development
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    console.log('[SessionWrapper] Rendering')
  }

  // Theo dõi lỗi với NextAuth
  useEffect(() => {
    if (isDev) {
      const authErrorHandler = (event: any) => {
        if (event.type === 'error' && event.target?.src?.includes('next-auth')) {
          console.error('[SessionWrapper] NextAuth error detected:', event)
        }
      }
      
      window.addEventListener('error', authErrorHandler)
      
      // Fix cho việc load React hooks sớm trong Next.js 15
      window.__NEXT_REACT_ROOT = true
      
      return () => {
        window.removeEventListener('error', authErrorHandler)
      }
    }
  }, [isDev])

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
})

export default SessionWrapper

// Đặt giá trị toàn cục để đảm bảo JSX runtime được tìm thấy
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__NEXT_REACT_ROOT = true
} 