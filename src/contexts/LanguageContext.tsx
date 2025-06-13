'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Language, translations } from '@/locales';

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

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('vi');

  // Khởi tạo ngôn ngữ từ localStorage (nếu có)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Cập nhật ngôn ngữ và lưu vào localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Hàm dịch văn bản
  const t = (key: string, params?: Record<string, any>): string => {
    const translation = translations[language][key];
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    if (!params) {
      return translation;
    }

    // Thay thế các tham số trong chuỗi dịch
    return translation.replace(/{([^}]+)}/g, (_: string, paramName: string) => {
      if (params[paramName] === undefined) {
        console.warn(`Parameter not provided: ${paramName}`);
        return `{${paramName}}`;
      }
      return convertValueToString(params[paramName], paramName);
    });
  };

  function convertValueToString(value: any, paramName: string): string {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null) {
      return 'null';
    }
    if (value === undefined) {
      return 'undefined';
    }
    console.warn(`Cannot convert parameter ${paramName} to string:`, value);
    return JSON.stringify(value);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 