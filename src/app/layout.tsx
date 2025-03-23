import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Analytics from '@/components/Analytics'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import SessionWrapper from '@/components/SessionWrapper'

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

// ErrorLogger component để theo dõi và log các lỗi
function ErrorLogger() {
  if (typeof window !== 'undefined') {
    // Ghi lại tất cả các lỗi không bắt được
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Ghi lại tất cả các reject không bắt được
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', {
        promise: event.promise,
        reason: event.reason?.stack || event.reason
      });
    });
  }
  return null;
}

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
  return (
    <html lang="vi" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/images/hero-image.svg"
          as="image"
          type="image/svg+xml"
        />
        <link 
          rel="preload" 
          href="/fonts/inter-var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col antialiased">
        <ErrorLogger />
        <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700">Đã xảy ra lỗi khi tải trang. Vui lòng tải lại trang.</div>}>
          <SessionWrapper>
            {children}
          </SessionWrapper>
        </ErrorBoundary>
        <Analytics />
        <Script
          id="performance-metrics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Core web vitals optimization
              window.addEventListener('DOMContentLoaded', () => {
                console.log('DOM Content Loaded');
                
                // Optimize LCP (Largest Contentful Paint)
                const lcpElement = document.querySelector('main');
                if (lcpElement) {
                  lcpElement.style.contentVisibility = 'auto';
                }
                
                // Optimize CLS (Cumulative Layout Shift)
                document.body.style.overflowX = 'hidden';
                
                // Optimize FID (First Input Delay)
                setTimeout(() => {
                  const links = Array.from(document.querySelectorAll('a[href], button'));
                  if (links.length > 0) {
                    const io = new IntersectionObserver((entries) => {
                      entries.forEach(entry => {
                        if (entry.isIntersecting) {
                          entry.target.setAttribute('data-prefetched', 'true');
                          io.unobserve(entry.target);
                        }
                      });
                    });
                    links.forEach(link => io.observe(link));
                  }
                }, 1000);
              });
              
              // Thêm global error tracking
              window.onerror = function(message, source, lineno, colno, error) {
                console.error('Global JS Error:', { message, source, lineno, colno, stack: error?.stack });
                return false;
              };
            `,
          }}
        />
      </body>
    </html>
  )
} 