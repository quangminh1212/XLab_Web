'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';

export default function HeaderEnglishButton() {
  const { preferredLanguage, setPreferredLanguage, setTranslated } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTranslate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Translate button clicked'); // Debug
    
    // Sử dụng Google Translate miễn phí
    const currentUrl = window.location.href;
    const targetLang = 'en'; // Luôn dịch sang tiếng Anh từ nút này
    
    // Cập nhật ngôn ngữ ưa thích
    setPreferredLanguage(targetLang);
    setTranslated(true);
    
    // Chuyển hướng đến Google Translate
    setTimeout(() => {
      window.location.href = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
    }, 100);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleTranslate}
      className="inline-flex items-center space-x-1 rounded-full px-2 py-1 text-sm text-gray-800 hover:text-teal-600 transition-colors"
    >
      <span className="text-base mr-1">🌐</span>
      <span>English</span>
    </button>
  );
} 