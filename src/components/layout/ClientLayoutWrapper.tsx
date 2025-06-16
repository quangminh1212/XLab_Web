'use client';

import React, { useEffect, useState } from 'react';
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

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  // Add hydration safety
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SessionProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BalanceProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                {/* Only render Header after client-side hydration is complete */}
                {isClient ? <Header /> : <div style={{ height: '64px' }} />}
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
