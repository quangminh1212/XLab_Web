'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie } from 'cookies-next';

interface TranslationContextType {
  isTranslated: boolean;
  setTranslated: (value: boolean) => void;
  preferredLanguage: string;
  setPreferredLanguage: (lang: string) => void;
  showBanner: boolean;
  hideBanner: () => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [preferredLanguage, setPreferredLang] = useState('vi');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Khôi phục trạng thái từ cookie khi component load
    const translatedStatus = getCookie('google-translated');
    const preferredLang = getCookie('preferred-language');
    const bannerVisible = getCookie('translation-banner');
    
    if (translatedStatus === 'true') {
      setIsTranslated(true);
    }
    
    if (preferredLang) {
      setPreferredLang(preferredLang as string);
    }
    
    if (bannerVisible === 'hidden') {
      setShowBanner(false);
    }
  }, []);

  const setTranslated = (value: boolean) => {
    setIsTranslated(value);
    setCookie('google-translated', value ? 'true' : 'false', { maxAge: 30 * 24 * 60 * 60 });
  };

  const setPreferredLanguage = (lang: string) => {
    setPreferredLang(lang);
    setCookie('preferred-language', lang, { maxAge: 30 * 24 * 60 * 60 });
  };

  const hideBanner = () => {
    setShowBanner(false);
    setCookie('translation-banner', 'hidden', { maxAge: 30 * 24 * 60 * 60 });
  };

  return (
    <TranslationContext.Provider 
      value={{ 
        isTranslated, 
        setTranslated, 
        preferredLanguage, 
        setPreferredLanguage, 
        showBanner, 
        hideBanner 
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
} 