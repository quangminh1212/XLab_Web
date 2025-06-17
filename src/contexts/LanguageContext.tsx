'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { locales } from '../locales';

type Language = 'vi' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Create a context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Use the imported translations
const translations: Record<Language, Record<string, string>> = locales;

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Default to Vietnamese
  const [language, setLanguageState] = useState<Language>('vi');

  // Initialize language from localStorage when component is mounted
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    try {
      // Check for valid key
      if (typeof key !== 'string' || !key) {
        console.warn('Invalid translation key:', key);
        return '';
      }
      
      // Get translation string or return key if not found
      let text = translations[language]?.[key] || key;
      
      // Replace parameters if any
      if (params && typeof params === 'object' && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([param, value]) => {
          const regex = new RegExp(`\\{${param}\\}`, 'g');
          const strValue = convertValueToString(value, param);
          text = text.replace(regex, strValue);
        });
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return typeof key === 'string' ? key : '';
    }
  };
  
  // Helper function to safely convert values to string
  function convertValueToString(value: any, paramName: string): string {
    if (value === undefined || value === null) {
      return '';
    }
    
    if (typeof value === 'object') {
      try {
        return String(value);
      } catch (err) {
        console.warn(`Error converting object param ${paramName}:`, err);
        return '';
      }
    }
    
    try {
      return String(value);
    } catch (err) {
      console.warn(`Error converting param ${paramName}:`, err);
      return '';
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use this context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
