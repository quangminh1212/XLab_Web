'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageAutoSwitcher = (): JSX.Element | null => {
  const { setLanguage } = useLanguage();
  
  useEffect(() => {
    // Tự động chuyển ngôn ngữ sang tiếng Tây Ban Nha
    setLanguage('es');
  }, [setLanguage]);
  
  // Component này không render gì cả
  return null;
};

export default LanguageAutoSwitcher; 