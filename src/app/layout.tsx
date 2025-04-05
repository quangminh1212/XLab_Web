'use client'

import React, { useEffect, useState } from 'react'
import '@/styles/globals.css'
import { Inter, Roboto } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import SessionProvider from '@/components/SessionProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/siteConfig'
import { usePathname } from 'next/navigation'
import ScriptComponent from '@/components/ScriptComponent'
import { setupPartytown } from '@/utils/partytown'
import { errorLog } from '@/utils/debugHelper'
import ErrorBoundary from '@/components/ErrorBoundary'

// Load Inter font
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

// Cấu hình font Roboto
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-roboto',
})

// Các trang không hiển thị header và footer (ví dụ: trang đăng nhập)
const noLayoutPaths = ['/login', '/register', '/admin/login']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false);

  // Kiểm tra xem có cần hiển thị header và footer không
  const showLayout = !noLayoutPaths.includes(pathname || '')

  // Sử dụng useEffect một cách an toàn để xử lý các tác động phía client
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Thiết lập ngôn ngữ cho thẻ html
      document.documentElement.lang = 'vi'
      
      // Thiết lập tiêu đề trang
      document.title = siteConfig.seo.defaultTitle

      // Khởi tạo Partytown nếu cần
      try {
        if (typeof setupPartytown === 'function') {
          console.log('Gọi setupPartytown');
          setupPartytown()
        }
      } catch (partytownError) {
        errorLog('Lỗi khi gọi setupPartytown', partytownError);
      }
    } catch (error) {
      errorLog('Error in RootLayout useEffect:', error)
    }

    setMounted(true);
  }, [])

  // In phiên bản Next.js khi debug
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Next.js version:', process.env.NEXT_PUBLIC_DEBUG ? '15.2.4' : 'production');
      console.log('Browser user agent:', window.navigator.userAgent);
    }
  }, []);

  return (
    <html lang="vi" className={`${inter.variable} ${roboto.variable} scroll-smooth`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="description" content={siteConfig.seo.defaultDescription} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col text-gray-900 bg-gray-50">
        <noscript>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white p-4">
            <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-4">{siteConfig.noJavaScriptTitle}</h2>
              <p>{siteConfig.noJavaScriptMessage}</p>
            </div>
          </div>
        </noscript>

        <ErrorBoundary>
          <SessionProvider>
            <LanguageProvider>
              {showLayout && <Header />}
              <main id="main-content" className="flex-grow">
                {mounted ? children : <div className="flex justify-center items-center min-h-screen">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
                </div>}
              </main>
              {showLayout && <Footer />}
            </LanguageProvider>
          </SessionProvider>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
} 