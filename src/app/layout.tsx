import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SessionProvider from '@/components/SessionProvider'
import Script from 'next/script'

// Tối ưu font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s | XLab - Phần mềm và Dịch vụ',
    default: 'XLab - Phần mềm và Dịch vụ Chuyên Nghiệp',
  },
  description: 'XLab cung cấp các giải pháp phần mềm và dịch vụ chuyên nghiệp cho doanh nghiệp, mang đến hiệu quả và đổi mới',
  applicationName: 'XLab Software',
  authors: [{ name: 'XLab Team', url: 'https://xlab.com' }],
  keywords: ['phần mềm', 'dịch vụ CNTT', 'giải pháp doanh nghiệp', 'phát triển phần mềm', 'cloud services'],
  category: 'technology',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://xlab.com',
    title: 'XLab - Phần mềm và Dịch vụ Chuyên Nghiệp',
    description: 'XLab cung cấp các giải pháp phần mềm và dịch vụ chuyên nghiệp cho doanh nghiệp, mang đến hiệu quả và đổi mới',
    siteName: 'XLab',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'XLab - Phần mềm và Dịch vụ Chuyên Nghiệp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XLab - Phần mềm và Dịch vụ Chuyên Nghiệp',
    description: 'XLab cung cấp các giải pháp phần mềm và dịch vụ chuyên nghiệp cho doanh nghiệp',
    images: ['/images/twitter-image.jpg'],
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
      <body className={`${inter.className} antialiased text-gray-800 bg-white`}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary-500 focus:text-white focus:z-50">
              Bỏ qua phần điều hướng
            </a>
            <Header />
            <main id="main-content" className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SessionProvider>

        {/* Structured data for better SEO */}
        <Script
          id="schema-org-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'XLab',
              url: 'https://xlab.com',
              logo: 'https://xlab.com/logo.png',
              sameAs: [
                'https://www.facebook.com/xlab',
                'https://www.linkedin.com/company/xlab',
                'https://twitter.com/xlab',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+84-123-456-789',
                contactType: 'customer service',
                availableLanguage: ['Vietnamese', 'English'],
              },
            }),
          }}
        />
      </body>
    </html>
  )
} 