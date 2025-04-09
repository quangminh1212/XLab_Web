'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';

export default function EnglishButton() {
  const { preferredLanguage, setPreferredLanguage, setTranslated } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [setTranslated]);

  const handleTranslate = () => {
    // Sử dụng Google Translate miễn phí
    const currentUrl = window.location.href;
    const targetLang = 'en'; // Luôn dịch sang tiếng Anh từ nút này
    
    // Cập nhật ngôn ngữ ưa thích
    setPreferredLanguage(targetLang);
    setTranslated(true);
    
    // Chuyển hướng đến Google Translate
    window.location.href = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleTranslate}
      className="inline-flex items-center justify-center gap-1 font-medium px-3 py-1.5 text-sm hover:text-teal-600 transition-colors"
      aria-label="Translate to English"
    >
      <span role="img" aria-label="Globe" className="text-base">🌐</span>
      <span>English</span>
    </button>
  );
} 