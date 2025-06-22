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
  const [language, setLanguageState] = useState<Language>('vi');

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
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
    
    // Nếu key có dấu chấm (ví dụ: 'common.nav.home')
    if (parts.length > 1) {
      const moduleName = parts[0]; // Lấy module (common, home, admin, ...)
      // Sử dụng as để tránh lỗi TypeScript với string indexer
      const langData = translations[language] as Record<string, any>;
      let value = langData[moduleName]; // Lấy đúng module dịch
      
      // Đi từng cấp để lấy giá trị dịch
      for (let i = 1; i < parts.length; i++) {
        if (!value || typeof value !== 'object') {
          return key; // Nếu không tìm thấy, trả về key gốc
        }
        value = value[parts[i]];
      }
      
      // Nếu tìm thấy và là chuỗi, trả về chuỗi đó
      if (typeof value === 'string') {
        // Xử lý các tham số (nếu có)
        if (params) {
          Object.keys(params).forEach(paramKey => {
            value = value.replace(`{${paramKey}}`, String(params[paramKey]));
          });
        }
        return value;
      }
      
      // Nếu không phải chuỗi, trả về key gốc
      return key;
    } 
    else {
      // Tìm trong tất cả các module nếu key không có dấu chấm
      const langData = translations[language] as Record<string, any>;
      for (const moduleName in langData) {
        const moduleValue = langData[moduleName];
        if (moduleValue && typeof moduleValue === 'object' && key in moduleValue) {
          let value = moduleValue[key];
          if (typeof value === 'string') {
            // Xử lý các tham số (nếu có)
            if (params) {
              Object.keys(params).forEach(paramKey => {
                value = value.replace(`{${paramKey}}`, String(params[paramKey]));
              });
            }
            return value;
          }
        }
      }
      
      // Nếu không tìm thấy, trả về key gốc
      return key;
    }
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