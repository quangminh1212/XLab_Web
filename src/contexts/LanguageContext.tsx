'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import locales, { Translations } from '../../locales';

type Language = 'vie' | 'eng';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T = string>(key: string, params?: Record<string, any>, returnObject?: boolean) => T extends true ? any : string;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Tạo một context mới
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use translations from imported locales file
const translations: Record<Language, Translations> = {
  vie: locales.vie,
  eng: locales.eng
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('vie');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vie' || savedLanguage === 'eng')) {
      setLanguageState(savedLanguage as Language);
    } else if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      // Migration from old format
      const newLang = savedLanguage === 'vi' ? 'vie' : 'eng';
      setLanguageState(newLang);
      localStorage.setItem('language', newLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = <T = string>(key: string, params?: Record<string, any>, returnObject?: boolean): T extends true ? any : string => {
    try {
      // Navigate to the value by splitting the key by dots
      const parts = key.split('.');
      let value: any = translations[language];
      for (const part of parts) {
        if (!value || typeof value !== 'object') {
          return key as any;
        }
        value = value[part];
      }

      // Return the object if requested
      if (returnObject && typeof value === 'object') {
        return value as any;
      }

      // Handle string values with parameters
      if (typeof value === 'string' && params) {
        return value.replace(/\{([^}]+)\}/g, (_, paramName) => {
          return params[paramName] !== undefined 
            ? convertValueToString(params[paramName], paramName) 
            : `{${paramName}}`;
        }) as any;
      }

      // Return the value or the key if not found
      return (value !== undefined ? value : key) as any;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return key as any;
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