import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
<<<<<<< HEAD
import { Inter } from 'next/font/google'
=======
// Sử dụng CSS thông thường thay vì next/font
// import { Inter } from 'next/font/google'
>>>>>>> 2aea817a
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { siteConfig } from '@/config/siteConfig'
import SessionProvider from '@/components/SessionProvider'
<<<<<<< HEAD

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
=======
import { CartProvider } from '@/lib/CartContext'
import './globals.css'
import Providers from '@/lib/providers'
import TopNav from '@/components/TopNav'
import Script from 'next/script'

// Thay thế Inter font bằng CSS thông thường
// const inter = Inter({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800'],
//   variable: '--font-inter',
// })

export const metadata: Metadata = {
  title: 'XLab - Phần mềm và Dịch vụ',
  description: 'XLab cung cấp các giải pháp phần mềm và dịch vụ công nghệ hàng đầu. Khám phá các sản phẩm, dịch vụ và giải pháp của chúng tôi ngay hôm nay.',
  keywords: 'XLab, phần mềm, dịch vụ công nghệ, giải pháp công nghệ, công nghệ thông tin, IT services',
  authors: [{ name: 'XLab Team' }],
  creator: 'XLab',
  publisher: 'XLab',
  openGraph: {
    title: 'XLab - Phần mềm và Dịch vụ',
    description: 'XLab cung cấp các giải pháp phần mềm và dịch vụ công nghệ hàng đầu.',
    url: 'https://xlab.vn',
    siteName: 'XLab',
    locale: 'vi_VN',
    type: 'website',
  },
>>>>>>> 2aea817a
  robots: {
    index: true,
    follow: true,
  },
<<<<<<< HEAD
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
=======
  icons: {
    icon: '/favicon.ico',
  }
>>>>>>> 2aea817a
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
<<<<<<< HEAD
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  )
=======
  // Error boundary to handle rendering errors
  const handleError = (error: Error) => {
    console.error('Root layout encountered an error:', error);
    // You could potentially log this to a service
    return (
      <html lang="vi">
        <body className="font-sans">
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
            <p>Chúng tôi đang cố gắng khắc phục sự cố. Vui lòng thử lại sau.</p>
          </div>
        </body>
      </html>
    );
  };

  try {
    return (
      <html lang="vi" className="scroll-smooth">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <Script id="polyfills-script" strategy="beforeInteractive">
            {`
              // Comprehensive polyfills for missing globals
              if (typeof window !== 'undefined') {
                // Ensure JSON.parse is safe
                const originalJSONParse = JSON.parse;
                JSON.parse = function safeJSONParse(text, reviver) {
                  if (text === undefined || text === null) return {};
                  try {
                    return originalJSONParse(text, reviver);
                  } catch (error) {
                    console.error('JSON parse error:', error);
                    return {};
                  }
                };

                // Make sure global objects exist
                if (!window.process) {
                  window.process = { 
                    env: { 
                      NODE_ENV: '${process.env.NODE_ENV || 'development'}' 
                    },
                    version: '',
                    cwd: function() { return '/' }
                  };
                }
                
                window.global = window;
                
                // Ensure Buffer exists
                if (typeof Buffer === 'undefined') {
                  window.Buffer = {
                    isBuffer: function() { return false; },
                    from: function(data) { return data; },
                  };
                }

                // Safe function call helper
                window.safeFunctionCall = function(obj, fnName, ...args) {
                  if (obj && typeof obj[fnName] === 'function') {
                    try {
                      return obj[fnName](...args);
                    } catch (error) {
                      console.error('Error calling ' + fnName + ':', error);
                      return undefined;
                    }
                  }
                  return undefined;
                };
              }
            `}
          </Script>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased">
          <Providers>
            <SessionProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen">
                  <TopNav />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Analytics />
              </CartProvider>
            </SessionProvider>
          </Providers>
        </body>
      </html>
    );
  } catch (error) {
    return handleError(error as Error);
  }
>>>>>>> 2aea817a
} 