'use client';

<<<<<<< HEAD
<<<<<<< HEAD
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { LanguageKeys, defaultLanguage, getTranslation, translations } from '../locales';

type LanguageContextType = {
  language: LanguageKeys;
  currentLanguage: LanguageKeys;
  setLanguage: (lang: LanguageKeys) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: LanguageKeys[];
  locale: string;
=======
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import locales, { Translations } from '../../locales';

type Language = 'vie' | 'eng';
=======
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import translations, { Language } from '@/i18n';
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  isClient: boolean;
  t: <T = string>(key: string, params?: Record<string, any>, returnObject?: boolean) => T extends true ? any : string;
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
};

// Get available languages from translations object
const availableLanguagesArray = Object.keys(translations).filter(
  lang => translations[lang as keyof typeof translations]
) as LanguageKeys[];

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  currentLanguage: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages: availableLanguagesArray,
  locale: 'vi-VN'
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with defaultLanguage for both server and client
  const [language, setLanguageState] = useState<LanguageKeys>(defaultLanguage);
  // Track whether component is mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // Map language to locale
  const getLocaleFromLanguage = (lang: LanguageKeys): string => {
    switch (lang) {
      case 'eng': return 'en-US';
      case 'spa': return 'es-ES';
      case 'vie': return 'vi-VN';
      default: return 'en-US';
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
  useEffect(() => {
    // This will only run on the client side after hydration
    setIsMounted(true);
    
    // Check for saved language preference after component is mounted
    const savedLanguage = localStorage.getItem('language') as LanguageKeys;
    
    // Ensure we use a valid language or fallback to Vietnamese
    if (savedLanguage && availableLanguagesArray.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      // Log language initialization from localStorage
      if (process.env.NODE_ENV === 'development') {
        try {
          const { logLanguageInit } = require('@/utils/localeDebug');
          logLanguageInit(savedLanguage, 'localStorage');
        } catch (e) {
          console.warn('Could not log language initialization:', e);
        }
      }
    } else {
      // Explicitly set to Vietnamese if no valid language is saved
      setLanguageState('vie');
      localStorage.setItem('language', 'vie');
      // Log default language initialization
      if (process.env.NODE_ENV === 'development') {
        try {
          const { logLanguageInit } = require('@/utils/localeDebug');
          logLanguageInit('vie', 'default');
        } catch (e) {
          console.warn('Could not log language initialization:', e);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Only update localStorage after mounting to prevent hydration mismatch
    if (isMounted) {
      localStorage.setItem('language', language);
      
      // Force a rerender of critical components by setting a data attribute
      document.documentElement.setAttribute('data-language', language);
    }
  }, [language, isMounted]);

  const setLanguage = (lang: LanguageKeys) => {
    if (availableLanguagesArray.includes(lang)) {
      // Use our debug utility for logging language changes
      if (process.env.NODE_ENV === 'development') {
        try {
          const { logLanguageSwitch } = require('@/utils/localeDebug');
          logLanguageSwitch(language, lang, 'user');
        } catch (e) {
          console.warn('Could not log language switch:', e);
        }
      }
      setLanguageState(lang);
=======
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
    // Get language data
    const langData = translations[language];
    if (!langData) {
      console.warn(`No translations found for language: ${language}`);
      return key;
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
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
<<<<<<< HEAD

  const t = (key: string, params?: Record<string, string | number>) => {
    // Get translation string or return key if not found
    let text = getTranslation(key, language);

    // Replace parameters if any
    if (params && typeof params === 'object' && Object.keys(params).length > 0) {
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, String(params[param]));
      });
=======
// Use translations from imported locales file
const translations: Record<Language, Translations> = {
  vie: locales.vie,
  eng: locales.eng
};

// Display warning for keys not found during development
const isDevelopment = process.env.NODE_ENV === 'development';

// Default language - MUST be the same on server and client for first render
const DEFAULT_LANGUAGE: Language = 'vie';

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Start with the default language to avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  // Track if we're on the client side
  const [isClient, setIsClient] = useState(false);

  // After initial render, check for stored language preference
  useEffect(() => {
    setIsClient(true);
    try {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'vie' || savedLanguage === 'eng')) {
        setLanguageState(savedLanguage as Language);
      } else if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        // Migration from old format
        const newLang = savedLanguage === 'vi' ? 'vie' : 'eng';
        setLanguageState(newLang);
        localStorage.setItem('language', newLang);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Update localStorage when language changes (but only after initial client-side hydration)
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('language', language);
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  }, [language, isClient]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = <T = string>(key: string, params?: Record<string, any>, returnObject?: boolean): T extends true ? any : string => {
    try {
      // Make sure key is a string
      if (typeof key !== 'string') {
        console.error('Translation key must be a string:', key);
        return String(key) as any;
      }

      // Navigate to the value by splitting the key by dots
      const parts = key.split('.');
      let value: any = translations[language];
      
      // Check if we have translations for the current language
      if (!value) {
        console.error(`No translations found for language: ${language}`);
        return key as any;
      }

      // Navigate through the parts of the key
      for (const part of parts) {
        if (!value || typeof value !== 'object') {
          if (isDevelopment) {
            console.warn(`Translation not found for key: ${key} in language: ${language}`);
          }
          return key as any;
        }
        value = value[part];
      }

      // Return the object if requested
      if (returnObject && typeof value === 'object') {
        return value as any;
      }

      // If value is undefined after going through all parts, return the key
      if (value === undefined) {
        if (isDevelopment) {
          console.warn(`Translation not found for key: ${key} in language: ${language}`);
        }
        return key as any;
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
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
    }

    return text;
  };

<<<<<<< HEAD
  const locale = getLocaleFromLanguage(language);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      currentLanguage: language, 
      setLanguage, 
      t, 
      availableLanguages: availableLanguagesArray,
      locale
    }}>
=======
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
=======
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isClient, t }}>
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
      {children}
    </LanguageContext.Provider>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export const useLanguage = () => useContext(LanguageContext);
=======
export const useLanguage = (): LanguageContextType => {
=======
export const useLanguage = () => {
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider; 
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
