'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';

interface TranslateButtonProps {
  className?: string;
}

export default function TranslateButton({ className = '' }: TranslateButtonProps) {
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
      className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Translate page"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="m5 8 6 6" />
        <path d="m4 14 6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
      <span>{preferredLanguage === 'vi' ? 'English' : 'Tiếng Việt'}</span>
    </button>
  );
} 