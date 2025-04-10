'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';

export default function HeaderEnglishButton() {
  const { preferredLanguage, setPreferredLanguage, setTranslated } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTranslate = () => {
    console.log('Translate button clicked', new Date().toISOString());
    
    try {
      // Lấy URL hiện tại
      const currentUrl = window.location.href;
      const targetLang = 'en'; // Luôn dịch sang tiếng Anh
      
      // Cập nhật ngôn ngữ ưa thích trong context
      setPreferredLanguage(targetLang);
      setTranslated(true);
      
      // URL Google Translate
      const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
      
      // Chuyển hướng trực tiếp thay vì mở tab mới để tránh bị chặn popup
      window.location.href = translateUrl;
    } catch (error) {
      console.error('Lỗi khi chuyển hướng đến Google Translate:', error);
      alert('Đã xảy ra lỗi khi chuyển hướng. Vui lòng thử lại sau.');
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleTranslate}
      type="button"
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
      aria-label="Dịch sang tiếng Anh"
    >
      <span role="img" aria-label="Globe" className="text-base">🌐</span>
      <span>English</span>
    </button>
  );
} 