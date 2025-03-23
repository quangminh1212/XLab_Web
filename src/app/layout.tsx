'use client';

import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'
import Analytics from '@/components/Analytics'
import ClientSessionProvider from '@/components/ClientSessionProvider'
import React, { useEffect } from 'react'
import { debugLog, logError } from '@/utils/debugLogger'

// Initialize app-level debugging
if (typeof window !== 'undefined') {
  debugLog('App', 'Application initialization started', { 
    url: window.location.href,
    userAgent: window.navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString()
  });

  // Add global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    debugLog(
      'GlobalErrorHandler',
      `Uncaught error: ${event.message}`,
      {
        filename: event.filename,
        lineNo: event.lineno,
        colNo: event.colno,
        error: event.error?.stack || event.error,
      },
      'error'
    );
    // Don't prevent default behavior - let the browser handle it normally
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    debugLog(
      'GlobalErrorHandler',
      'Unhandled Promise Rejection',
      {
        reason: event.reason?.stack || event.reason,
      },
      'error'
    );
  });
}

// Add global error logger for console.error
const originalConsoleError = console.error;
console.error = function(...args) {
  // Log original error
  originalConsoleError.apply(console, args);

  try {
    // Add to debug logs
    const errorMessage = args[0]?.toString() || 'Unknown console.error';
    debugLog('ConsoleError', errorMessage, { args }, 'error');

    // Add extra context for 'call' related errors
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('call')) {
      debugLog('CallErrorContext', 'Found call-related error in console output', {
        functionProto: typeof Function.prototype.call === 'function' ? 'exists' : 'missing',
        prototypeChain: Object.getPrototypeOf(Function)
      }, 'warn');
    }
  } catch (e) {
    // Don't crash if our logging fails
    originalConsoleError('Error in console.error override:', e);
  }
};

// Optimize font loading - use only Google Fonts with font-display: swap
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

// These metadata declarations will be moved to a metadata object
// in the exported configuration below
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

function DebugOverlay() {
  return (
    <div id="debug-floating-indicator" style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '10px',
      fontFamily: 'monospace',
      zIndex: 9999,
      cursor: 'pointer',
    }} onClick={() => {
      const debugElement = document.getElementById('debug-log-container');
      if (debugElement) {
        debugElement.style.display = debugElement.style.display === 'none' ? 'block' : 'none';
      }
    }}>
      DEBUG MODE
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  debugLog('RootLayout', 'Layout component rendering started');

  // Add more detailed debug information in development
  useEffect(() => {
    debugLog('RootLayout', 'Layout component mounted', {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      reactVersion: React.version
    }, 'success');

    // Check if document.body is ready
    if (document && document.body) {
      debugLog('RootLayout', 'document.body is available', null, 'success');
    } else {
      debugLog('RootLayout', 'document.body is NOT available', null, 'error');
    }

    // Check Function.prototype.call
    try {
      const testFn = function(this: any, arg: string) { return `Test: ${arg}`; };
      const result = Function.prototype.call.call(testFn, null, 'call test');
      debugLog('RootLayout', 'Function.prototype.call test succeeded', { result }, 'success');
    } catch (error) {
      logError('RootLayout', error);
      debugLog('RootLayout', 'Function.prototype.call test failed', { error }, 'error');
    }

    return () => {
      debugLog('RootLayout', 'Layout component unmounting');
    };
  }, []);

  // We use a try/catch block to render the layout to catch any errors
  try {
    debugLog('RootLayout', 'Rendering root layout tree');
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
                __html: `console.log('DEBUG: Layout head script executed at ${new Date().toISOString()}');` 
              }} 
            />
          )}
        </head>
        <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
          {process.env.NODE_ENV === 'development' && <DebugOverlay />}
          
          {/* Wrap components in error boundaries */}
          <ErrorCatcher componentName="ClientSessionProvider">
            <ClientSessionProvider>
              <ErrorCatcher componentName="Header">
                <Header />
              </ErrorCatcher>
              
              <main className="flex-grow">
                <ErrorCatcher componentName="MainContent">
                  {children}
                </ErrorCatcher>
              </main>
              
              <ErrorCatcher componentName="Footer">
                <Footer />
              </ErrorCatcher>
            </ClientSessionProvider>
          </ErrorCatcher>

          {/* Debug log output element will be created by the logger */}
          
          <Analytics />
          <Script
            id="debug-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                console.log('DEBUG: afterInteractive script executed at ${new Date().toISOString()}');
                // Log browser information
                console.log('Browser info:', {
                  userAgent: navigator.userAgent,
                  viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                  },
                  location: window.location.href,
                  timestamp: new Date().toISOString()
                });
              `,
            }}
          />

          {/* Original analytics scripts */}
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            onLoad={() => debugLog('Analytics', 'Google Analytics script loaded', null, 'success')}
            onError={(e) => debugLog('Analytics', 'Google Analytics script failed to load', { error: e }, 'error')}
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
    logError('RootLayout:render', error);
    
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
            
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 15px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </body>
      </html>
    );
  }
}

// Simple error boundary component
function ErrorCatcher({ 
  children, 
  componentName 
}: { 
  children: React.ReactNode; 
  componentName: string;
}) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    debugLog('ErrorCatcher', `Mounted for ${componentName}`);
    
    // Add error event listener specific to this component
    const handleError = (event: ErrorEvent) => {
      // We only want to catch errors from our children
      // This is a simple heuristic and not perfect
      debugLog('ErrorCatcher', `Error event caught in ${componentName}`, {
        message: event.error?.message,
        stack: event.error?.stack
      }, 'warn');
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      debugLog('ErrorCatcher', `Unmounted for ${componentName}`);
    };
  }, [componentName]);

  if (hasError) {
    return (
      <div style={{
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ffcccc',
        borderRadius: '4px',
        backgroundColor: '#fff5f5',
        color: '#e53e3e',
      }}>
        <p><strong>Error in {componentName}:</strong></p>
        <p>{error?.message || 'Unknown error'}</p>
        <button
          onClick={() => setHasError(false)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#e53e3e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  try {
    debugLog('ErrorCatcher', `Rendering children for ${componentName}`);
    return <>{children}</>;
  } catch (e) {
    const error = e as Error;
    setError(error);
    setHasError(true);
    logError(`ErrorCatcher:${componentName}`, error);
    return (
      <div style={{
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ffcccc',
        borderRadius: '4px',
        backgroundColor: '#fff5f5',
        color: '#e53e3e',
      }}>
        <p><strong>Render Error in {componentName}:</strong></p>
        <p>{error.message || 'Unknown error'}</p>
      </div>
    );
  }
} 