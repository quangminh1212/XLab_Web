'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Các thư mục ngôn ngữ
import viNavigation from '../locales/vi/common/navigation.json';
import enNavigation from '../locales/en/common/navigation.json';
import viFooter from '../locales/vi/common/footer.json';
import enFooter from '../locales/en/common/footer.json';

// Product module
import viProduct from '../locales/vi/product/index.json';
import viFeatured from '../locales/vi/product/featured.json';
import viLoader from '../locales/vi/product/loader.json';
import viSpeech from '../locales/vi/product/speech.json';

import enFeatured from '../locales/en/product/featured.json';
import enLoader from '../locales/en/product/loader.json';
import enSpeech from '../locales/en/product/speech.json';

// Home module
import viHome from '../locales/vi/home/index.json';
import viFeatures from '../locales/vi/home/features.json';
import viFaq from '../locales/vi/home/faq.json';

import enFeatures from '../locales/en/home/features.json';

// About module
import viAbout from '../locales/vi/about/index.json';
import viCompany from '../locales/vi/about/company.json';

// Admin module
import viAdminNotifications from '../locales/vi/admin/notifications.json';

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

// Hàm tiện ích để gộp các đối tượng lồng nhau
const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  
  if (typeof target === 'object' && typeof source === 'object') {
    Object.keys(source).forEach(key => {
      if (typeof source[key] === 'object') {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

// Tạo các bản dịch từ các module riêng biệt
const buildTranslations = () => {
  // Tiếng Việt
  const vi = {
    nav: viNavigation && viNavigation.nav ? viNavigation.nav : {},
    footer: viFooter || {},
    common: {
      navigation: viNavigation || {},
      footer: viFooter || {}
    },
    product: {
      ...viProduct || {},
      featured: viFeatured || {},
      loader: viLoader || {},
      speech: viSpeech || {}
    },
    home: {
      ...viHome || {},
      features: viFeatures || {},
      faq: viFaq || {}
    },
    about: {
      ...viAbout || {},
      company: viCompany || {}
    },
    admin: {
      notifications: viAdminNotifications || {}
    }
  };

  // Tiếng Anh - chỉ có một số module được dịch
  const en = {
    nav: enNavigation && enNavigation.nav ? enNavigation.nav : {},
    footer: enFooter || {},
    common: {
      navigation: enNavigation || {},
      footer: enFooter || {}
    },
    product: {
      featured: enFeatured || {},
      loader: enLoader || {},
      speech: enSpeech || {}
    },
    home: {
      features: enFeatures || {}
    }
  };

  return {
    vi,
    en
  };
};

// Translations
const translations = buildTranslations();

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Default language is Vietnamese
  const [language, setLanguageState] = useState<Language>('vi');

  // Load saved language preference from localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
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
    
    // Nếu không tìm thấy trong ngôn ngữ hiện tại, thử tìm trong ngôn ngữ mặc định (vi)
    if (text === undefined && language !== 'vi') {
      text = getNestedValue(translations.vi, key);
    }

    // Nếu vẫn không tìm thấy, sử dụng key
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