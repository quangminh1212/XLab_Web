'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { getLocaleFromPath } from './index';
import { messages } from './index';

export interface UseTranslationType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: string;
  changeLocale: (newLocale: string) => void;
}

export function useTranslation(): UseTranslationType {
  const pathname = usePathname() || '';
  const currentLocale = getLocaleFromPath(pathname);
  const [locale, setLocale] = useState(currentLocale);
  
  // Prepare for locale change
  const changeLocale = useCallback((newLocale: string) => {
    if (newLocale === locale) return;
    
    // Set locale in cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Redirect to the same path but with new locale
    const segments = pathname.split('/').filter(Boolean);
    let newPath = '/' + newLocale;
    
    // If there are path segments after the locale, keep them
    if (segments.length > 0 && (segments[0] === 'vi' || segments[0] === 'en')) {
      const pathWithoutLocale = segments.slice(1).join('/');
      newPath += pathWithoutLocale ? `/${pathWithoutLocale}` : '';
    } else {
      newPath += pathname;
    }
    
    // Redirect to the new path
    window.location.href = newPath;
  }, [locale, pathname]);

  // Update locale if pathname changes
  useEffect(() => {
    const pathLocale = getLocaleFromPath(pathname);
    if (pathLocale !== locale) {
      setLocale(pathLocale);
    }
  }, [pathname, locale]);

  // Translation function
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    // Get the message from the current locale
    const localeMessages = messages[locale as keyof typeof messages] || messages.vi;
    let message = localeMessages[key as keyof typeof localeMessages] as string || key;
    
    // Replace parameters if provided
    if (params && message) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        message = message.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return message;
  }, [locale]);

  return { t, locale, changeLocale };
} 