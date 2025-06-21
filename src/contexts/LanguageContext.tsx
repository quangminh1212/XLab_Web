'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { LanguageKeys, defaultLanguage, getTranslation, translations } from '../locales';

type LanguageContextType = {
  language: LanguageKeys;
  currentLanguage: LanguageKeys;
  setLanguage: (lang: LanguageKeys) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: LanguageKeys[];
  locale: string;
};

// Get available languages from translations object
const availableLanguagesArray = Object.keys(translations).filter(
  lang => translations[lang as keyof typeof translations]
) as LanguageKeys[];

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: availableLanguagesArray,
  locale: 'vi-VN'
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with defaultLanguage for both server and client
  const [language, setLanguageState] = useState<LanguageKeys>(defaultLanguage);
  // Track whether component is mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // Map language to locale
  const getLocaleFromLanguage = (lang: LanguageKeys): string => {
    switch (lang) {
      case 'eng': return 'en-US';
      case 'spa': return 'es-ES';
      case 'vie': return 'vi-VN';
      case 'chi': return 'zh-CN';
      default: return 'en-US';
    }
  };

  useEffect(() => {
    // This will only run on the client side after hydration
    setIsMounted(true);
    
    // Check for saved language preference after component is mounted
    const savedLanguage = localStorage.getItem('language') as LanguageKeys;
    
    // Ensure we use a valid language or fallback to Vietnamese
    if (savedLanguage && availableLanguagesArray.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      // Log language initialization from localStorage
      if (process.env.NODE_ENV === 'development') {
        try {
          const { logLanguageInit } = require('@/utils/localeDebug');
          logLanguageInit(savedLanguage, 'localStorage');
        } catch (e) {
          console.warn('Could not log language initialization:', e);
        }
      }
    } else {
      // Explicitly set to Vietnamese if no valid language is saved
      setLanguageState('vie');
      localStorage.setItem('language', 'vie');
      // Log default language initialization
      if (process.env.NODE_ENV === 'development') {
        try {
          const { logLanguageInit } = require('@/utils/localeDebug');
          logLanguageInit('vie', 'default');
        } catch (e) {
          console.warn('Could not log language initialization:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Only update localStorage after mounting to prevent hydration mismatch
    if (isMounted) {
      localStorage.setItem('language', language);
      
      // Force a rerender of critical components by setting a data attribute
      document.documentElement.setAttribute('data-language', language);
    }
  }, [language, isMounted]);

  const setLanguage = (lang: LanguageKeys) => {
    if (availableLanguagesArray.includes(lang)) {
      // Use our debug utility for logging language changes
      if (process.env.NODE_ENV === 'development') {
        try {
          const { logLanguageSwitch } = require('@/utils/localeDebug');
          logLanguageSwitch(language, lang, 'user');
        } catch (e) {
          console.warn('Could not log language switch:', e);
        }
      }
      setLanguageState(lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    // Get translation string or return key if not found
    let text = getTranslation(key, language);

    // Replace parameters if any
    if (params && typeof params === 'object' && Object.keys(params).length > 0) {
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, String(params[param]));
      });
    }

    return text;
  };

  const locale = getLocaleFromLanguage(language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      currentLanguage: language, 
      setLanguage, 
      t, 
      availableLanguages: availableLanguagesArray,
      locale
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
