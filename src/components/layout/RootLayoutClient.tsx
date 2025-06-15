'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientLayoutWrapper from './ClientLayoutWrapper';

interface RootLayoutClientProps {
  children: ReactNode;
  locale: string;
}

export default function RootLayoutClient({ children, locale }: RootLayoutClientProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <NextIntlClientProvider locale={locale}>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 