'use client'

import React from 'react'
import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Roboto } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { SessionProvider } from '@/contexts/SessionContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/siteConfig'
import { usePathname } from 'next/navigation'

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

// Thêm export type metadata và viewport cho server component
export { metadata, viewport } from './_metadata'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Kiểm tra xem có cần hiển thị header và footer không
  const showLayout = !noLayoutPaths.includes(pathname || '')

  // Thêm use client directive để tránh lỗi hydration và useLayoutEffect
  React.useEffect(() => {
    // Thiết lập ngôn ngữ cho thẻ html
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'vi'
    }
  }, [])

  return (
    <html lang="vi" className={`${inter.variable} ${roboto.variable} scroll-smooth`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="description" content="XLab cung cấp phần mềm và dịch vụ CNTT đáng tin cậy cho doanh nghiệp" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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

        <SessionProvider>
          <LanguageProvider>
            {showLayout && <Header />}
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            {showLayout && <Footer />}
          </LanguageProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
} 