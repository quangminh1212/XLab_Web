'use client';

import React from 'react';
import { Footer } from '@/components/layout';
import {
  Analytics,
  CompileIndicator,
  StyleLoader,
  CssErrorHandler,
  GlobalStyles,
} from '@/components/common';
import { SessionProvider } from '@/components/auth';
import { CartProvider } from '@/components/cart';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Dynamically load the Header on the client only to avoid mismatches that rely on browser-specific APIs.
// We purposely do **not** provide a built-in `loading` fallback here. Instead, we
// wrap the component in a <Suspense> boundary further below so that the server
// renders the same element tree (<Suspense> + fallback <header/>) that the
// client initially sees during hydration. This keeps the markup in sync and
// prevents the "Hydration failed" warning that appears when the server renders
// the fallback element directly while the client renders a <Suspense> wrapper.
const Header = React.lazy(() => import('@/components/layout/Header'));

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BalanceProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                {/* Header is client-only; we return null on the server to keep
                   the markup identical between server and the first client
                   paint. The real Header will mount right after hydration. */}
                <React.Suspense
                  fallback={
                    <header
                      className="bg-white shadow-sm sticky top-0 z-50 flex items-center justify-between"
                      style={{ minHeight: '60px' }}
                    />
                  }
                >
                  <Header />
                </React.Suspense>
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Analytics />
              <CompileIndicator />
              <StyleLoader />
              <CssErrorHandler />
              <GlobalStyles />
            </CartProvider>
          </BalanceProvider>
        </NotificationProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
