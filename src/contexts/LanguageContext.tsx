'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import locales, { Translations } from '../../locales';

type Language = 'vi' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Tạo một context mới
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use translations from imported locales file
const translations: Record<Language, Translations> = {
  vi: locales.vi,
  en: locales.en
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    try {
      const value = translations[language][key] || key;
      
      if (!params) {
        return value;
      }

      // Handle template parameters
      return value.replace(/\{([^}]+)\}/g, (_, paramName) => {
        return params[paramName] !== undefined 
          ? convertValueToString(params[paramName], paramName) 
          : `{${paramName}}`;
      });
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  function convertValueToString(value: any, paramName: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (error) {
        console.error(`Could not stringify object parameter: ${paramName}`, error);
        return '[object]';
      }
    }
    
    return String(value);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider; 