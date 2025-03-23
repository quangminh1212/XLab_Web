import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { ErrorLogger } from '@/utils/error-logger'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import SessionWrapper from '@/components/SessionWrapper'
import MainHeader from '@/components/MainHeader'
import Footer from '@/components/Footer'

// Tối ưu font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

// Thêm script để nâng cao debug
const DebugScript = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <Script id="debug-script" strategy="afterInteractive">
      {`
        // Log thông tin môi trường
        console.log('[Debug] Environment:', {
          nextJs: "${process.env.NEXT_PUBLIC_VERCEL_ENV || 'local'}",
          userAgent: navigator.userAgent,
          screen: { width: window.innerWidth, height: window.innerHeight }
        });
        
        // Log các lỗi chi tiết
        window.onerror = function(message, source, lineno, colno, error) {
          console.error('[Debug] JavaScript Error:', { 
            message, 
            source, 
            lineno, 
            colno,
            stack: error?.stack
          });
          return false;
        };
        
        // Log các unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
          console.error('[Debug] Unhandled Promise Rejection:', {
            reason: event.reason?.stack || event.reason || 'Unknown',
            promise: event.promise
          });
        });
        
        // Log các network errors
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
          try {
            const response = await originalFetch(...args);
            if (!response.ok) {
              console.warn('[Debug] Fetch Error:', {
                url: args[0],
                status: response.status,
                statusText: response.statusText
              });
            }
            return response;
          } catch (error) {
            console.error('[Debug] Fetch Failed:', {
              url: args[0],
              error: error.message,
              stack: error.stack
            });
            throw error;
          }
        };
        
        // Log thông tin về các Component gặp lỗi
        const origError = console.error;
        console.error = function() {
          // Lọc ra các lỗi React thường gặp
          if (arguments[0]?.includes && 
             (arguments[0].includes('Warning: ') || 
              arguments[0].includes('Error: '))) {
            console.warn('[Debug] React Error:', ...arguments);
          }
          origError.apply(console, arguments);
        };
      `}
    </Script>
  );
};

export const metadata: Metadata = {
  title: 'XLab Web Platform',
  description: 'XLab Web Platform - Dịch vụ tiện ích số và tự động hóa',
  applicationName: 'XLab Software',
  authors: [{ name: 'XLab Team', url: 'https://xlab.com' }],
  keywords: ['phần mềm', 'dịch vụ', 'công nghệ', 'tự động hóa', 'xlab'],
  category: 'technology',
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://xlab.com'),
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
  console.log('[RootLayout] Rendering')
  
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Không cần preload font Inter vì đã được Next Font xử lý */}
        <link
          rel="preload"
          href="/images/hero-image.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col antialiased">
        {/* Custom logging và debug script */}
        <DebugScript />
        
        {/* Error logger sẽ thiết lập global error handlers */}
        <ErrorLogger />
        
        <ErrorBoundary fallback={
          <div className="p-4 bg-red-50 text-red-700">
            Đã xảy ra lỗi khi tải trang. Vui lòng tải lại trang.
          </div>
        }>
          <SessionWrapper>
            <div className="flex flex-col min-h-screen">
              <MainHeader />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </SessionWrapper>
        </ErrorBoundary>
        
        <Script id="performance-metrics" strategy="afterInteractive">
          {`
            // Tối ưu Core Web Vitals
            document.addEventListener('DOMContentLoaded', function() {
              console.log('[Performance] DOM loaded');
              
              // Tối ưu LCP
              const lcpElement = document.querySelector('main');
              if (lcpElement) {
                lcpElement.style.contentVisibility = 'auto';
              }
              
              // Tối ưu CLS
              document.body.style.overflowX = 'hidden';
            });
          `}
        </Script>
      </body>
    </html>
  )
} 