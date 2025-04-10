'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { preferredLanguage, setPreferredLanguage, setTranslated } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTranslate = () => {
    // Sử dụng Google Translate miễn phí
    const currentUrl = window.location.href;
    const targetLang = preferredLanguage === 'vi' ? 'en' : 'vi';
    
    // Cập nhật ngôn ngữ ưa thích
    setPreferredLanguage(targetLang);
    setTranslated(true);
    
    // Sử dụng dịch vụ Google Translate miễn phí
    window.location.href = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={handleTranslate} 
      className={className}
    >
      {preferredLanguage === 'vi' ? 'English' : 'Tiếng Việt'}
    </button>
  );
} 