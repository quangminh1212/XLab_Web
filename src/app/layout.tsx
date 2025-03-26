import Link from 'next/link'
import { Metadata } from 'next'
import './globals.css'
import { inter } from './fonts'
import { Providers } from './providers'
import Header from './components/Header'
import Footer from './components/Footer'

// Sử dụng font system thay vì tải từ Google Fonts
const fontClass = 'system-font'

export const metadata: Metadata = {
  title: 'XLab - Giải pháp phần mềm chất lượng cao',
  description: 'XLab cung cấp các giải pháp phần mềm chất lượng cao cho doanh nghiệp và cá nhân tại Việt Nam',
  keywords: 'phần mềm, software, ứng dụng, xlab, công cụ',
  metadataBase: new URL('https://xlab.vn'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', sizes: '32x32', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'XLab - Phần mềm chất lượng cao',
    description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
    url: 'https://xlab.vn',
    siteName: 'XLab',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'XLab - Phần mềm chất lượng cao',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XLab - Phần mềm chất lượng cao',
    description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
    images: ['/images/og-image.svg'],
    creator: '@xlabvn',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
} 