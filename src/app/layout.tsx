import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Header, Footer } from '@/components/layout'
import { Analytics, CompileIndicator } from '@/components/common'
import { siteConfig } from '@/config/siteConfig'
import { SessionProvider } from '@/components/auth'
import { CartProvider } from '@/components/cart'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { BalanceProvider } from '@/contexts/BalanceContext'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: siteConfig.seo.titleTemplate,
    default: siteConfig.seo.defaultTitle,
  },
  description: siteConfig.seo.defaultDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legal.companyName, url: siteConfig.url }],
  keywords: ['phần mềm', 'dịch vụ CNTT', 'giải pháp doanh nghiệp', 'phát triển phần mềm', 'cloud services'],
  category: 'technology',
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.seo.defaultTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    creator: siteConfig.seo.twitterHandle,
    images: [siteConfig.seo.ogImage],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/images/topup.png' },
      { url: '/images/topup.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/topup.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/topup.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/images/topup.png', color: '#2563EB' },
    ],
  },
  other: {
    'msapplication-TileColor': '#00A19A',
    'theme-color': '#ffffff',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00A19A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          <NotificationProvider>
            <BalanceProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Analytics />
                <CompileIndicator />
              </CartProvider>
            </BalanceProvider>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 