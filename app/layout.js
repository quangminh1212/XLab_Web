'use client';

import { Inter } from 'next/font/google'
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <title>XLab - Phần mềm và Dịch vụ</title>
        <meta name="description" content="XLab cung cấp các giải pháp phần mềm và dịch vụ công nghệ hàng đầu." />
      </head>
      <body className={inter.className}>
        <div className="main-content">
          {children}
        </div>
      </body>
    </html>
  )
} 