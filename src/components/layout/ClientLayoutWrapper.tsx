'use client';

import React from 'react';
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
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <SessionProvider>
      <NotificationProvider>
        <BalanceProvider>
          <CartProvider>
            {children}
            <Analytics />
            <CompileIndicator />
            <StyleLoader />
            <CssErrorHandler />
            <GlobalStyles />
          </CartProvider>
        </BalanceProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
