'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// This component doesn't render anything but updates the HTML lang attribute
// when the language changes
const LanguageHtmlUpdater: React.FC = () => {
  const { language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const htmlElement = document.documentElement;
    if (htmlElement) {
      htmlElement.lang = language;
    }
  }, [language, isMounted]);

  return null;
};

export default LanguageHtmlUpdater; 