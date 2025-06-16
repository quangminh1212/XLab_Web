'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Import language mapping
import languageMap from '@/locales/languageMap.json';

type Language = 'vi' | 'en';
type NewLanguage = 'vie' | 'eng';

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

// Legacy translations - for backward compatibility
const legacyTranslations: Record<Language, Record<string, string>> = {
  vi: {
    // Essential navigation translations to prevent hydration mismatch
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.about': 'Giới thiệu',
    'nav.contact': 'Liên hệ',
    'nav.warranty': 'Bảo hành',
    'nav.login': 'Đăng nhập',
    'nav.logout': 'Đăng xuất',
    'nav.account': 'Tài khoản',
    'nav.admin': 'Quản trị',
  },
  en: {
    // Essential navigation translations to prevent hydration mismatch
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.warranty': 'Warranty',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.account': 'Account',
    'nav.admin': 'Admin',
  }
};

// Translation cache to avoid loading the same files multiple times
const translationCache: Record<string, Record<string, any>> = {};

// Loads a translation file dynamically 
const loadTranslation = async (language: NewLanguage, namespace: string) => {
  const cacheKey = `${language}/${namespace}`;
  
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }
  
  try {
    const translationModule = await import(`@/locales/${language}/${namespace}.json`);
    translationCache[cacheKey] = translationModule.default || translationModule;
    return translationCache[cacheKey];
  } catch (error) {
    console.warn(`Failed to load translation: ${language}/${namespace}`, error);
    
    // Try to load from old locale format if new one fails
    if (language === 'eng') {
      try {
        const oldTranslationModule = await import(`@/locales/en/${namespace}.json`);
        translationCache[cacheKey] = oldTranslationModule.default || oldTranslationModule;
        return translationCache[cacheKey];
      } catch (oldError) {
        console.warn(`Failed to load from old locale path as well: en/${namespace}`, oldError);
      }
    } else if (language === 'vie') {
      try {
        const oldTranslationModule = await import(`@/locales/vi/${namespace}.json`);
        translationCache[cacheKey] = oldTranslationModule.default || oldTranslationModule;
        return translationCache[cacheKey];
      } catch (oldError) {
        console.warn(`Failed to load from old locale path as well: vi/${namespace}`, oldError);
      }
    }
    
    return {};
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>('vi');
  
  // Translation cache for the current session - initialize with legacy translations to prevent hydration mismatch
  const [translations, setTranslations] = useState<Record<string, string>>(legacyTranslations['vi']);

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
      // Immediately update translations with the language's legacy translations to prevent hydration mismatch
      setTranslations(prev => ({...prev, ...legacyTranslations[savedLanguage as Language]}));
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
      
      // Phân tách namespace từ key (admin.notifications.title -> admin/notifications, title)
      const parts = key.split('.');
      let namespace = '';
      let translationKey = key;
      
      if (parts.length > 1) {
        // Nếu key có cấu trúc namespace.key hoặc namespace.subnamespace.key
        if (parts.length >= 3) {
          namespace = `${parts[0]}/${parts[1]}`;
          translationKey = parts.slice(2).join('.');
        } else {
          namespace = parts[0];
          translationKey = parts.slice(1).join('.');
        }
      }
      
      // Lấy chuỗi dịch từ cache hiện tại
      let text = translations[key];
      
      // Nếu không tìm thấy trong cache, dùng legacy translations
      if (!text && legacyTranslations[language] && legacyTranslations[language][key]) {
        text = legacyTranslations[language][key];
      }
      
      // Nếu vẫn không tìm thấy, trả về key
      if (!text) {
        text = key;
      }
      
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
  
  // Preload translations for commonly used namespaces and dynamically requested ones
  useEffect(() => {
    const loadCommonTranslations = async () => {
      const newLang = languageMap[language] as NewLanguage;
      
      try {
        // Load commonly used namespaces
        const commonNamespaces = ['admin/notifications', 'admin/index', 'terms/index', 'home/index', 'nav/index'];
        const loadPromises = commonNamespaces.map(namespace => loadTranslation(newLang, namespace));
        
        const results = await Promise.allSettled(loadPromises);
        const newTranslations: Record<string, string> = {};
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            const namespace = commonNamespaces[index];
            const parts = namespace.split('/');
            
            if (parts.length === 2) {
              const [section, subsection] = parts;
              
              // Handle nested translations
              if (subsection === 'index') {
                // For index files, use the section as the base namespace
                Object.entries(result.value).forEach(([key, value]) => {
                  if (typeof value === 'string') {
                    newTranslations[`${section}.${key}`] = value;
                  } else if (value && typeof value === 'object') {
                    Object.entries(value as Record<string, string>).forEach(([subKey, subValue]) => {
                      newTranslations[`${section}.${key}.${subKey}`] = subValue;
                    });
                  }
                });
              } else {
                // For other files, use the full namespace
                Object.entries(result.value).forEach(([key, value]) => {
                  if (typeof value === 'string') {
                    newTranslations[`${section}.${subsection}.${key}`] = value as string;
                  } else if (value && typeof value === 'object') {
                    Object.entries(value as Record<string, string>).forEach(([subKey, subValue]) => {
                      newTranslations[`${section}.${subsection}.${key}.${subKey}`] = subValue;
                    });
                  }
                });
              }
            }
          }
        });
        
        setTranslations(prev => ({ ...prev, ...newTranslations }));
      } catch (error) {
        console.error('Failed to preload translations', error);
      }
    };
    
    loadCommonTranslations();
  }, [language]);
  
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