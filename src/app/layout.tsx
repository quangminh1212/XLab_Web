import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'
import Analytics from '@/components/Analytics'
import ClientSessionProvider from '@/components/ClientSessionProvider'
import React from 'react'

// Add global error logger
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Log original error
    originalConsoleError.apply(console, args);
    
    // Add extra context for 'call' related errors
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('call')) {
      originalConsoleError.apply(console, ['CALL ERROR CONTEXT: Current component tree state:', React]);
      
      // Log component stack if available
      if (args[1] && args[1].componentStack) {
        originalConsoleError.apply(console, ['Component stack:', args[1].componentStack]);
      }
    }
  };

  // Add global error handler to catch unhandled errors
  window.addEventListener('error', function(event) {
    console.error('GLOBAL ERROR:', event.error);
    console.error('GLOBAL ERROR MESSAGE:', event.message);
    console.error('GLOBAL ERROR FILENAME:', event.filename);
    console.error('GLOBAL ERROR LINENO:', event.lineno);
    console.error('GLOBAL ERROR COLNO:', event.colno);
  });
  
  // Special handling for promise rejection errors
  window.addEventListener('unhandledrejection', function(event) {
    console.error('UNHANDLED PROMISE REJECTION:', event.reason);
    if (event.reason && event.reason.stack) {
      console.error('REJECTION STACK:', event.reason.stack);
    }
  });
}

// Optimize font loading - use only Google Fonts with font-display: swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
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
    creator: '@xlab',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/android-chrome-192x192.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code',
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/android-chrome-192x192.png',
    'theme-color': '#ffffff',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('DEBUG: Rendering RootLayout');
    console.log('DEBUG: React version:', React.version);
  }

  try {
    return (
      <html lang="vi" className={`${inter.variable} scroll-smooth`}>
        <head>
          {/* Preconnect to domains for critical resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          
          {/* Debug information in development */}
          {process.env.NODE_ENV === 'development' && (
            <script 
              dangerouslySetInnerHTML={{ 
                __html: `console.log('DEBUG: Layout script executed');` 
              }} 
            />
          )}
        </head>
        <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
          <ClientSessionProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ClientSessionProvider>

          {/* Add debugging info */}
          {process.env.NODE_ENV === 'development' && (
            <div id="debug-info" style={{ display: 'none' }}>
              <script dangerouslySetInnerHTML={{ 
                __html: `
                  console.log('DEBUG: Body script executed');
                  document.addEventListener('DOMContentLoaded', function() {
                    console.log('DEBUG: DOM fully loaded');
                  });
                ` 
              }} />
            </div>
          )}
          
          <Analytics />
          <Script
            id="debug-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                console.log('DEBUG: afterInteractive script executed');
                // Check for call-related errors
                window._checkCallErrors = function() {
                  console.log('DEBUG: Checking for call errors');
                  try {
                    // Test various objects
                    if (window.React) console.log('DEBUG: React is defined');
                    if (window.ReactDOM) console.log('DEBUG: ReactDOM is defined');
                    if (window.next) console.log('DEBUG: Next is defined');
                  } catch (e) {
                    console.error('DEBUG: Error in call error check:', e);
                  }
                };
                setTimeout(window._checkCallErrors, 1000);
              `,
            }}
          />

          {/* Original analytics scripts */}
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script
            id="google-analytics-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </body>
      </html>
    )
  } catch (error) {
    console.error('DEBUG: Critical error in RootLayout:', error);
    // Return minimal fallback UI
    return (
      <html>
        <head>
          <title>Error Loading Application</title>
        </head>
        <body>
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            fontFamily: 'system-ui, sans-serif' 
          }}>
            <h1>Application Error</h1>
            <p>The application encountered a critical error. Please try refreshing the page.</p>
            <pre style={{ 
              textAlign: 'left', 
              backgroundColor: '#f7f7f7', 
              padding: '10px', 
              borderRadius: '4px',
              whiteSpace: 'pre-wrap'
            }}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          </div>
        </body>
      </html>
    );
  }
} 