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
    
    console.log('Translate button clicked'); // Debug
    
    // Sử dụng Google Translate miễn phí
    const currentUrl = window.location.href;
    const targetLang = 'en'; // Luôn dịch sang tiếng Anh từ nút này
    
    // Cập nhật ngôn ngữ ưa thích
    setPreferredLanguage(targetLang);
    setTranslated(true);
    
    // Dùng window.open thay vì window.location để tránh lỗi chuyển hướng
    window.open(`https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  if (!mounted) return null;

  // Style nút giống hệt như trong hình ảnh
  return (
    <button
      onClick={handleTranslate}
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span role="img" aria-label="Globe" className="text-base">🌐</span>
      <span>English</span>
    </button>
  );
} 