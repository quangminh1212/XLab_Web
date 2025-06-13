'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Language, vi, en, es } from '@/locales';

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

// Tập hợp các bản dịch từ các file ngôn ngữ
const translations = {
  vi,
  en,
  es
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>('vi');

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage as Language);
    }
  }, []);

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Hàm dịch văn bản
  const t = (key: string, params?: Record<string, any>): string => {
    try {
      // Kiểm tra key hợp lệ
      if (typeof key !== 'string' || !key) {
        console.warn('Invalid translation key:', key);
        return '';
      }
      
      // Lấy chuỗi dịch hoặc trả về key nếu không tìm thấy
      let text = translations[language]?.[key] || key;
      
      // Thay thế tham số nếu có
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
  
  // Hàm hỗ trợ chuyển đổi giá trị thành chuỗi an toàn
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

// Hook để sử dụng context này
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 