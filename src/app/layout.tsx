'use client'

import React, { useEffect } from 'react'
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

  // Kiểm tra xem có cần hiển thị header và footer không
  const showLayout = !noLayoutPaths.includes(pathname || '')

  // Thêm use client directive để tránh lỗi hydration và useLayoutEffect
  useEffect(() => {
    // Kiểm tra môi trường client một cách rõ ràng
    if (typeof window !== 'undefined') {
      // Không thiết lập ngôn ngữ cho thẻ html ở đây để tránh xung đột với LanguageContext
      // Thiết lập sẽ được thực hiện bởi LanguageContext

      // Thiết lập tiêu đề trang
      document.title = siteConfig.seo.defaultTitle

      // Khởi tạo Partytown nếu cần
      setupPartytown()
    }
  }, [])

  return (
    <html lang="vi" className={`${inter.variable} ${roboto.variable} scroll-smooth`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="description" content={siteConfig.seo.defaultDescription} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Thêm vào các script cần thiết mà không sử dụng next/script */}
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