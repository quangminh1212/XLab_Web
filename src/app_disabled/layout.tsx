import React from 'react'
import '@/styles/globals.css'
import { Inter } from 'next/font/google'

// Đơn giản hóa cấu hình font
const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

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
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
} 