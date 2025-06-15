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
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider>
          <TranslationProvider>
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
          </TranslationProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
