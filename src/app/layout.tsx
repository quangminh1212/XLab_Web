import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { siteConfig } from '@/config/siteConfig'
import SessionProvider from '@/components/SessionProvider'
import { CartProvider } from '@/components/ui/CartContext'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
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
      { url: '/images/topup.png' },
      { url: '/images/topup.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/topup.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/topup.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/images/topup.png', color: '#0070f3' },
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <header className="border-b bg-white py-5 shadow-sm sticky top-0 z-50">
                <div className="container max-w-6xl mx-auto px-6 flex justify-between items-center">
                  <Link href="/" className="text-2xl font-bold flex items-center">
                    <span className="text-primary">X</span>
                    <span className="text-gray-800">Lab</span>
                  </Link>
                  
                  <nav className="hidden md:flex items-center space-x-8">
                    <Link 
                      href="/" 
                      className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Trang chủ
                    </Link>
                    <Link 
                      href="/products" 
                      className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Sản phẩm
                    </Link>
                    <Link 
                      href="/services" 
                      className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Dịch vụ
                    </Link>
                    <Link 
                      href="/about" 
                      className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Giới thiệu
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-lg font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      Liên hệ
                    </Link>
                  </nav>

                  <div className="flex items-center space-x-4">
                    <Link href="/cart" className="relative p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="absolute top-0 right-0 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
                    </Link>
                    
                    <Link 
                      href="/login" 
                      className="hidden md:block bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    
                    <button className="md:hidden p-2" aria-label="Menu">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </header>
              
              <main className="flex-grow">{children}</main>
              
              <footer className="bg-gray-800 text-white py-12">
                <div className="container max-w-6xl mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                      <h3 className="text-xl font-bold mb-4">XLab</h3>
                      <p className="text-gray-300 mb-4">
                        Giải pháp công nghệ toàn diện cho doanh nghiệp của bạn.
                      </p>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-300 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                          </svg>
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </a>
                        <a href="#" className="text-gray-300 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-4">Liên kết</h3>
                      <ul className="space-y-2">
                        <li><Link href="/" className="text-gray-300 hover:text-white">Trang chủ</Link></li>
                        <li><Link href="/products" className="text-gray-300 hover:text-white">Sản phẩm</Link></li>
                        <li><Link href="/services" className="text-gray-300 hover:text-white">Dịch vụ</Link></li>
                        <li><Link href="/about" className="text-gray-300 hover:text-white">Giới thiệu</Link></li>
                        <li><Link href="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-4">Dịch vụ</h3>
                      <ul className="space-y-2">
                        <li><Link href="/services/software-development" className="text-gray-300 hover:text-white">Phát triển phần mềm</Link></li>
                        <li><Link href="/services/cloud-services" className="text-gray-300 hover:text-white">Dịch vụ đám mây</Link></li>
                        <li><Link href="/services/consulting" className="text-gray-300 hover:text-white">Tư vấn công nghệ</Link></li>
                        <li><Link href="/services/technical-support" className="text-gray-300 hover:text-white">Hỗ trợ kỹ thuật</Link></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-300">123 Đường A, Quận B, TP. HCM</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-300">0123 456 789</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-300">info@xlab.vn</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} XLab. Tất cả các quyền được bảo lưu.</p>
                  </div>
                </div>
              </footer>
            </div>
            <Analytics />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 