'use client';

import React, { useEffect } from 'react';
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
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import TitleUpdater from '@/components/TitleUpdater';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

// Inner component that has access to language context
function InnerLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  
  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language === 'eng' ? 'en' : 'vi';
    }
  }, [language]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TitleUpdater />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BalanceProvider>
            <CartProvider>
              <InnerLayout>{children}</InnerLayout>
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
