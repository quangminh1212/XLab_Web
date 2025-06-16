'use client';

import React from 'react';
import { Header, Footer } from '@/components/layout';
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
import LanguageSwitcherMounter from '@/components/common/LanguageSwitcherMounter';

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
<<<<<<< HEAD
              <>
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
              </>
=======
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
              <LanguageSwitcherMounter />
>>>>>>> 062098a9c758cf94a27183b5874dd22c4d66a9f2
            </CartProvider>
          </BalanceProvider>
        </NotificationProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
