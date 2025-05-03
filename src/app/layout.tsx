import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
// import Header from '@/components/Header'
// import Footer from '@/components/Footer'
// import Analytics from '@/components/Analytics'
import { siteConfig } from '@/config/siteConfig'
// import SessionProvider from '@/components/SessionProvider'
import React from 'react'

// Khôi phục font Inter
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

// Khôi phục metadata và viewport
export const metadata: Metadata = {
  title: {
    template: siteConfig.seo.titleTemplate,
    default: siteConfig.seo.defaultTitle,
  },
  description: siteConfig.seo.defaultDescription,
  // ... (giữ các phần khác của metadata như cũ)
  other: {
    'msapplication-TileColor': '#0070f3',
    'theme-color': '#ffffff',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F766E',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Khôi phục Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {/* Vẫn không có SessionProvider, Header, Footer, Analytics */}
        {children}
      </body>
    </html>
  )
} 