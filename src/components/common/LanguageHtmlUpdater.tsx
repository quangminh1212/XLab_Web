'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// This component doesn't render anything but updates the HTML lang attribute
// when the language changes
const LanguageHtmlUpdater: React.FC = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.lang = language;
    }
  }, [language]);

  return null;
};

export default LanguageHtmlUpdater; 