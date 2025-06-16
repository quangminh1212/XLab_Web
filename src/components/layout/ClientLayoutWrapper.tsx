'use client';

import React from 'react';
import dynamic from 'next/dynamic';
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

// Load Header with CSR only to avoid hydration mismatch
const Header = dynamic(() => import('@/components/layout/Header'), {
  ssr: false,
  // Add a loading placeholder using <header> to match the final DOM structure
  loading: () => (
    <header
      className="bg-white shadow-sm sticky top-0 z-50 flex items-center justify-between"
      style={{ minHeight: '60px' }}
    />
  )
});

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
                <Header />
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
