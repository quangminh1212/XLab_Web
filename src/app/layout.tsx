'use client'

import React, { useEffect, useState } from 'react'
import '@/styles/globals.css'
import { Inter, Roboto } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { siteConfig } from '@/config/siteConfig'
import { usePathname } from 'next/navigation'
import { setupPartytown } from '@/utils/partytown'
import { errorLog } from '@/utils/debugHelper'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ensureJSONMethods } from '@/utils/safeJSON'
import { Providers } from './providers'
import { applyPolyfills } from '@/utils/polyfill'

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

  // Đảm bảo môi trường client hoạt động đúng - Chạy sớm nhất có thể
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Áp dụng tất cả polyfill cần thiết
        applyPolyfills();
        
        // Đảm bảo JSON hoạt động đúng
        ensureJSONMethods();
        
        console.log('Đã khởi tạo polyfill và JSON methods');
        window._jsonChecked = true;
      } catch (e) {
        errorLog('Lỗi khi khởi tạo polyfill và JSON methods:', e);
      }
    }
  }, []);

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
          console.log('Khởi tạo Partytown');
          setupPartytown()
        }
      } catch (partytownError) {
        errorLog('Lỗi khi khởi tạo Partytown:', partytownError);
      }
    } catch (error) {
      errorLog('Lỗi trong RootLayout useEffect:', error)
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
        
        {/* Thêm script cho JSON polyfill khi cần thiết */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Kiểm tra và khởi tạo JSON object nếu cần
            if (!window.JSON) {
              console.log('Initializing JSON polyfill');
              window.JSON = {
                parse: function(text) {
                  try { return eval('(' + text + ')'); } catch(e) { return null; }
                },
                stringify: function(obj) {
                  if (obj === null) return 'null';
                  if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\"') + '"';
                  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
                  return '{}';
                }
              };
            }
          `
        }} />
      </head>
      <body className="min-h-screen flex flex-col text-gray-900 bg-gray-50">
        <noscript>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white p-4">
            <div className="max-w-md p-6 bg-gray-800 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-4">{siteConfig.noJavaScriptTitle || 'JavaScript bị vô hiệu hóa'}</h2>
              <p>{siteConfig.noJavaScriptMessage || 'Vui lòng bật JavaScript để sử dụng trang web này'}</p>
            </div>
          </div>
        </noscript>

        <Providers>
          {showLayout && <Header />}
          <main id="main-content" className="flex-grow">
            {mounted ? children : <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
            </div>}
          </main>
          {showLayout && <Footer />}
        </Providers>
        
        <ErrorBoundary>
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
} 