import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { siteConfig } from '@/config/siteConfig'
import { ProductProvider } from '@/context/ProductContext'
import SessionProvider from '@/components/SessionProvider'

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#0070f3' },
    ],
  },
  other: {
    'msapplication-TileColor': '#0070f3',
    'theme-color': '#ffffff',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col antialiased">
        <noscript>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 text-white p-4">
            <div className="bg-red-600 p-6 rounded-lg max-w-md text-center">
              <h2 className="text-xl font-bold mb-2">JavaScript Bị Vô Hiệu Hóa</h2>
              <p>Website này yêu cầu JavaScript để hoạt động đúng. Vui lòng bật JavaScript và tải lại trang.</p>
            </div>
          </div>
        </noscript>

        <SessionProvider>
          <ProductProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary-500 focus:text-white focus:z-50">
              Bỏ qua phần điều hướng
            </a>
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </ProductProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
} 