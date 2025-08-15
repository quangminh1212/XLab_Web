'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import translations, { Language } from '@/i18n';
import { mapLanguageCode, mapToInternalCode } from '@/i18n/client';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  localCode: string; // Thêm localCode để sử dụng cho toLocaleString, v.v.
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Tạo một context mới
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>('vie');
  // Mã ngôn ngữ theo chuẩn locale (vi/en)
  const [localCode, setLocalCode] = useState<string>('vi');

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vie' || savedLanguage === 'eng')) {
      setLanguageState(savedLanguage as Language);
      setLocalCode(mapLanguageCode(savedLanguage as Language));
    }
  }, []);

  // Cập nhật localStorage khi ngôn ngữ thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setLocalCode(mapLanguageCode(lang));
    localStorage.setItem('language', lang);
  };

  // Hàm dịch
  const t = (key: string, params?: Record<string, any>): string => {
    // Get language data
    const langData = translations[language];
    if (!langData) {
      console.warn(`No translations found for language: ${language}`);
      return key;
    }

    // Try to get from flattened translations first (most direct approach)
    const flatValue = (langData as any)._flat[key];
    if (flatValue) {
      // Apply parameters if they exist
      if (params) {
        return Object.keys(params).reduce((text, paramKey) => {
          return text.replace(`{${paramKey}}`, String(params[paramKey]));
        }, flatValue);
      }
      return flatValue;
    }

    // If not found in flattened translations, try the previous approaches
    // Phân tách key để xác định module và khóa thực tế
    const parts = key.split('.');
    
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
      const moduleData = (langData as any)[moduleName];
      
      if (moduleData) {
        const value = getTranslationValue(moduleData, parts.slice(1));
        if (value) return value;
      }
    }
    
    // Tìm kiếm trong các module phổ biến nếu không có module prefix
    // Thử trong common trước
    const commonValue = getTranslationValue((langData as any).common, parts);
    if (commonValue) return commonValue;
    
    // Thử trong các module khác
    for (const moduleName in langData) {
      if (moduleName !== 'common' && moduleName !== '_flat') {
        const moduleData = (langData as any)[moduleName];
        const value = getTranslationValue(moduleData, parts);
        if (value) return value;
      }
    }
    
    // Nếu không tìm thấy, trả về key gốc
    console.warn(`Translation key not found: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, localCode }}>
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