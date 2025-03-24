'use client'

import { SessionProvider } from 'next-auth/react'
import { memo } from 'react'

/**
 * SessionWrapper component wraps the application with NextAuth SessionProvider
 * Được tối ưu với memo để ngăn re-render không cần thiết
 * Tương thích với Next.js 14+
 */
const SessionWrapper = memo(function SessionWrapper({ children }: { children: React.ReactNode }) {
  // Chỉ log trong môi trường development
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev) {
    console.log('[SessionWrapper] Rendering')
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
})

export default SessionWrapper 