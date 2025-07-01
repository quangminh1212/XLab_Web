'use client';

import { useState, useEffect } from 'react';
import translations, { Language } from './index';

interface TranslationResult {
  t: (key: string, variables?: Record<string, string | number>) => string;
  i18n: {
    language: Language;
    changeLanguage: (lang: Language) => void;
    getLocalCode: () => string;
  };
}

/**
 * Chuyển đổi từ mã ngôn ngữ nội bộ (vie/eng) sang mã ngôn ngữ tiêu chuẩn (vi/en)
 */
export const mapLanguageCode = (lang: Language): string => {
  const langMap: Record<Language, string> = {
    'vie': 'vi',
    'eng': 'en'
  };
  return langMap[lang] || 'vi';
};

/**
 * Chuyển đổi từ mã ngôn ngữ tiêu chuẩn (vi/en) sang mã ngôn ngữ nội bộ (vie/eng)
 */
export const mapToInternalCode = (code: string): Language => {
  if (code === 'en') return 'eng';
  return 'vie'; // mặc định là tiếng Việt
};

export function useTranslation(): TranslationResult {
  const [language, setLanguage] = useState<Language>('vie');

  useEffect(() => {
    // Try to get language from localStorage or cookie
    const storedLang = typeof window !== 'undefined' 
      ? localStorage.getItem('language') as Language || 'vie'
      : 'vie';
    
    // Check if navigator language is available and starts with 'en'
    const browserLang = typeof navigator !== 'undefined' 
      ? navigator.language.startsWith('en') ? 'eng' : 'vie'
      : 'vie';
      
    // Use stored language or fall back to browser language
    setLanguage(storedLang || browserLang);
  }, []);
  
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const flatKey = key;
    let translatedText = translations[language]._flat[flatKey] || key;
    
    // Replace variables in the translation string
    if (variables) {
      Object.keys(variables).forEach(varKey => {
        translatedText = translatedText.replace(
          new RegExp(`{${varKey}}`, 'g'), 
          String(variables[varKey])
        );
      });
    }
    
    return translatedText;
  };
  
  const changeLanguage = (newLanguage: Language): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
    setLanguage(newLanguage);
  };

  const getLocalCode = (): string => {
    return mapLanguageCode(language);
  };
  
  return {
    t,
    i18n: {
      language,
      changeLanguage,
      getLocalCode
    }
  };
} 