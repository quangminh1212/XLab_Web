'use client';

import React, { useMemo } from 'react';
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

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

// Memoize the cart provider to prevent unnecessary re-renders
const MemoizedCartProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    console.log(`[${Date.now()}] 🛒 Creating memoized cart provider - should happen once`);
    return <CartProvider>{children}</CartProvider>;
  }
);

MemoizedCartProvider.displayName = 'MemoizedCartProvider';

// Memoize the header and content to prevent triggering re-renders from the cart
const MemoizedLayout = React.memo(
  ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
);

MemoizedLayout.displayName = 'MemoizedLayout';

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BalanceProvider>
            <MemoizedCartProvider>
              <MemoizedLayout>{children}</MemoizedLayout>
              <Analytics />
              <CompileIndicator />
              <StyleLoader />
              <CssErrorHandler />
              <GlobalStyles />
            </MemoizedCartProvider>
          </BalanceProvider>
        </NotificationProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
