'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import translations from '@/locales';
import { useRouter, usePathname } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';

type TranslationsType = typeof translations;
type LocaleType = keyof TranslationsType;

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: LocaleType;
  changeLocale: (locale: LocaleType) => void;
  availableLocales: LocaleType[];
}

const TranslationContext = createContext<TranslationContextType>({
  t: () => '',
  locale: 'vi',
  changeLocale: () => {},
  availableLocales: ['vi', 'en'],
});

export const useTranslation = () => useContext(TranslationContext);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState<LocaleType>('vi');
  const availableLocales: LocaleType[] = ['vi', 'en'];

  // Load locale from cookie on initial render
  useEffect(() => {
    const savedLocale = getCookie('locale') as string;
    if (savedLocale && availableLocales.includes(savedLocale as LocaleType)) {
      setLocale(savedLocale as LocaleType);
    }
  }, []);

  const changeLocale = (newLocale: LocaleType) => {
    if (availableLocales.includes(newLocale)) {
      setLocale(newLocale);
      setCookie('locale', newLocale, { maxAge: 60 * 60 * 24 * 365 }); // 1 year
      
      // Refresh the current page to apply language change
      router.refresh();
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Get translation from the current locale or fallback to Vietnamese
    let translation = '';
    
    // Check if the key exists in the current locale
    if (translations[locale] && key in translations[locale]) {
      translation = translations[locale][key as keyof typeof translations[typeof locale]];
    } 
    // Fallback to Vietnamese
    else if (translations['vi'] && key in translations['vi']) {
      translation = translations['vi'][key as keyof typeof translations['vi']];
    } 
    // Fallback to the key itself
    else {
      translation = key;
    }
    
    // Replace parameters if provided
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(new RegExp(`{${key}}`, 'g'), String(value));
      }, translation);
    }
    
    return translation;
  };

  const value = {
    t,
    locale,
    changeLocale,
    availableLocales,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider; 