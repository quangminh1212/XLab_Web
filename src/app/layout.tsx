import React from 'react'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
// Bỏ Header và Footer vì đã chuyển vào LayoutWrapper
// import Header from '@/components/Header'
// import Footer from '@/components/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SessionProvider } from 'next-auth/react'
import LayoutWrapper from '@/components/LayoutWrapper' // Import LayoutWrapper

// Đơn giản hóa cấu hình font
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

// Các trang không hiển thị header và footer
// const noLayoutPaths = ['/login', '/register', '/admin/login'] // Logic này đã chuyển vào LayoutWrapper

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>XLab Web</title>
        <meta name="description" content="XLab Web Application" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <div className="p-4 bg-white">
          <h1 className="text-2xl font-bold">XLab Web - Debug Mode</h1>
          <p className="mb-4">Đơn giản hóa layout để khắc phục lỗi</p>
          <div className="border border-gray-300 p-4 rounded-md">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
} 