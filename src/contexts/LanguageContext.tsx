'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import viLocale from '../locales/vi.json';
import enLocale from '../locales/en.json';

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

// Translations
const translations: Record<Language, Record<string, any>> = {
  vi: viLocale,
  en: enLocale
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Default language is Vietnamese
  const [language, setLanguageState] = useState<Language>('vi');

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Function to get nested translation value using dot notation
  const getNestedValue = (obj: any, path: string): any => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    
    return result;
  };

  const t = (key: string, params?: Record<string, any>): string => {
    // Tìm giá trị dịch theo key (có thể là nested key như "home.title")
    let text = getNestedValue(translations[language], key);
    
    // Nếu không tìm thấy trong ngôn ngữ hiện tại, sử dụng key
    if (text === undefined) {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
      return key;
    }

    // Nếu text không phải string, trả về key
    if (typeof text !== 'string') {
      return key;
    }

    // Thay thế các tham số nếu có
    if (params) {
      for (const [paramName, paramValue] of Object.entries(params)) {
        const value = convertValueToString(paramValue, paramName);
        text = text.replace(new RegExp(`{${paramName}}`, 'g'), value);
      }
    }

    return text;
  };

  // Convert các giá trị param thành string
  function convertValueToString(value: any, paramName: string): string {
    if (value === null || value === undefined) {
      console.warn(`Parameter ${paramName} is null or undefined`);
      return '';
    }

    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    } else if (value instanceof Date) {
      return value.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    } else {
      try {
        return JSON.stringify(value);
      } catch {
        console.error(`Unable to convert parameter ${paramName} to string`);
        return '[Object]';
      }
    }
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