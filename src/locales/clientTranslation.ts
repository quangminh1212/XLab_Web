'use client';

import { useEffect, useState } from 'react';
import { LanguageKeys, getTranslation } from './index';

export function useTranslation(language?: LanguageKeys) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKeys | undefined>(language);
  
  useEffect(() => {
    // If no language is provided, try to get it from localStorage or use default
    if (!language) {
      const storedLanguage = typeof window !== 'undefined' 
        ? localStorage.getItem('language') as LanguageKeys || undefined
        : undefined;
      setCurrentLanguage(storedLanguage);
    } else {
      setCurrentLanguage(language);
    }
  }, [language]);
  
  const t = (key: string, params?: Record<string, any>): string => {
    let translation = getTranslation(key, currentLanguage);
    
    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };
  
  return { t };
} 