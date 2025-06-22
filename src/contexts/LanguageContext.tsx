'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import translations, { Language } from '@/i18n';

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
  // Mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>('vie');

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vie' || savedLanguage === 'eng')) {
      setLanguageState(savedLanguage as Language);
    }
  }, []);

  // Cập nhật localStorage khi ngôn ngữ thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Hàm dịch
  const t = (key: string, params?: Record<string, any>): string => {
    // Phân tách key để xác định module và khóa thực tế
    const parts = key.split('.');
    
    // Lấy language data
    const langData = translations[language] as Record<string, any>;
    if (!langData) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }
    
    // Hàm trả về giá trị dịch
    const getTranslationValue = (moduleData: any, keyParts: string[]): string | undefined => {
      let value = moduleData;
      
      for (const part of keyParts) {
        if (!value || typeof value !== 'object') {
          return undefined;
        }
        value = value[part];
      }
      
      if (typeof value === 'string') {
        // Xử lý các tham số (nếu có)
        if (params) {
          Object.keys(params).forEach(paramKey => {
            value = value.replace(`{${paramKey}}`, String(params[paramKey]));
          });
        }
        return value;
      }
      
      return undefined;
    };
    
    // Xử lý keys như 'module.key.subkey'
    if (parts.length > 1) {
      const moduleName = parts[0]; // Lấy module (common, home, admin, ...)
      const moduleData = langData[moduleName];
      
      if (moduleData) {
        const value = getTranslationValue(moduleData, parts.slice(1));
        if (value) return value;
      }
    }
    
    // Tìm kiếm trong các module phổ biến nếu không có module prefix
    // Thử trong common trước
    const commonValue = getTranslationValue(langData.common, parts);
    if (commonValue) return commonValue;
    
    // Thử trong các module khác
    for (const moduleName in langData) {
      if (moduleName !== 'common') {
        const moduleData = langData[moduleName];
        const value = getTranslationValue(moduleData, parts);
        if (value) return value;
      }
    }
    
    // Nếu không tìm thấy, trả về key gốc
    console.warn(`Translation key not found: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 