'use client'

import React from 'react'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Đơn giản hóa cấu hình font
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

// Các trang không hiển thị header và footer
const noLayoutPaths = ['/login', '/register', '/admin/login']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Tránh sử dụng usePathname vì có thể gây lỗi hydration
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const showLayout = !noLayoutPaths.includes(pathname);

  return (
    <html lang="vi" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>XLab Web</title>
        <meta name="description" content="XLab Web Application" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col text-gray-900 bg-gray-50">
        <LanguageProvider>
          {showLayout && <Header />}
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          {showLayout && <Footer />}
        </LanguageProvider>
      </body>
    </html>
  )
} 