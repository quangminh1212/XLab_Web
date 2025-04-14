'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ProductProvider } from '@/context/ProductContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ProductProvider>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary-500 focus:text-white focus:z-50">
          Bỏ qua phần điều hướng
        </a>
        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </ProductProvider>
    </SessionProvider>
  );
} 