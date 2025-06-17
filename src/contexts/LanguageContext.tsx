'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { LanguageKeys, defaultLanguage, getTranslation } from '../locales';

type LanguageContextType = {
  language: LanguageKeys;
  setLanguage: (lang: LanguageKeys) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: LanguageKeys[];
};

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: ['vie', 'eng'],
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with defaultLanguage for both server and client
  const [language, setLanguageState] = useState<LanguageKeys>(defaultLanguage);
  // Track whether component is mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  const availableLanguages: LanguageKeys[] = ['vie', 'eng'];

  useEffect(() => {
    // This will only run on the client side after hydration
    setIsMounted(true);
    
    // Check for saved language preference after component is mounted
    const savedLanguage = localStorage.getItem('language') as LanguageKeys;
    
    // Ensure we use a valid language or fallback to Vietnamese
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Explicitly set to Vietnamese if no valid language is saved
      setLanguageState('vie');
      localStorage.setItem('language', 'vie');
    }
    
    // Force language refresh
    document.documentElement.lang = savedLanguage === 'eng' ? 'en' : 'vi';
  }, []);

  useEffect(() => {
    // Only update localStorage after mounting to prevent hydration mismatch
    if (isMounted) {
      localStorage.setItem('language', language);
      
      // Update HTML lang attribute when language changes
      document.documentElement.lang = language === 'eng' ? 'en' : 'vi';
      
      // Force a rerender of critical components by setting a data attribute
      document.documentElement.setAttribute('data-language', language);
    }
  }, [language, isMounted]);

  const setLanguage = (lang: LanguageKeys) => {
    if (availableLanguages.includes(lang)) {
      console.log('Changing language to:', lang);
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
