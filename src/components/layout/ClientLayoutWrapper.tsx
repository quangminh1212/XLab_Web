'use client';

import React from 'react';
import { Header, Footer } from '@/components/layout';
import {
  Analytics,
  CompileIndicator,
  StyleLoader,
  CssErrorHandler,
  GlobalStyles,
  LanguageHtmlUpdater
} from '@/components/common';
import { SessionProvider } from '@/components/auth';
import { CartProvider } from '@/components/cart';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

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
              <LanguageHtmlUpdater />
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
