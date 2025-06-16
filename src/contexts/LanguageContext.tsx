'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import translations, { Language } from '@/locales';

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

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Default is Vietnamese
  const [language, setLanguageState] = useState<Language>('vi');

  // Initialize language from localStorage when component is mounted
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
      // Fallback to default language if there's an error
      setLanguageState('vi');
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (lang: Language) => {
    try {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    try {
      // Check valid key
      if (typeof key !== 'string' || !key) {
        console.warn('Invalid translation key:', key);
        return '';
      }
      
      // Get translation or return key if not found
      const currentTranslations = translations[language] as Record<string, string>;
      let text = currentTranslations?.[key] || key;
      
      // Replace parameters if any
      if (params && typeof params === 'object' && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([param, value]) => {
          try {
            const regex = new RegExp(`\\{${param}\\}`, 'g');
            const strValue = convertValueToString(value, param);
            text = text.replace(regex, strValue);
          } catch (paramError) {
            console.error(`Error replacing parameter ${param}:`, paramError);
          }
        });
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return typeof key === 'string' ? key : '';
    }
  };
  
  // Helper function to safely convert value to string
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