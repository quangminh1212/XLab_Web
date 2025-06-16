'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

// Tạo context
interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Provider component
export function ClientIntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const pathname = usePathname();
  
  // Detect locale from URL when component mounts
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const localeFromUrl = pathSegments[1];
    
    if (localeFromUrl && locales.includes(localeFromUrl as Locale)) {
      setLocale(localeFromUrl as Locale);
    }
  }, [pathname]);
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// Custom hook to use locale context
export function useClientLocale() {
  const context = useContext(LocaleContext);
  
  if (context === undefined) {
    return { locale: defaultLocale, setLocale: () => {} };
  }
  
  return context;
} 