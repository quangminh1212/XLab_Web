'use client';

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
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

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  locale: string;
  messages: any; // Hoặc sử dụng kiểu cụ thể hơn nếu có
}

export default function ClientLayoutWrapper({
  children,
  locale,
  messages,
}: ClientLayoutWrapperProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>
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
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
