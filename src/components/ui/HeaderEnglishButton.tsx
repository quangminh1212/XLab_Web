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
    // Không sử dụng e.preventDefault() vì có thể ngăn chặn hành động mặc định
    console.log('Translate button clicked', new Date().toISOString()); // Debug với timestamp
    
    try {
      // Sử dụng Google Translate miễn phí
      const currentUrl = window.location.href;
      const targetLang = 'en'; // Luôn dịch sang tiếng Anh từ nút này
      
      // Cập nhật ngôn ngữ ưa thích
      setPreferredLanguage(targetLang);
      setTranslated(true);
      
      // URL Google Translate
      const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
      
      // Mở URL trong tab mới
      const newWindow = window.open(translateUrl, '_blank');
      if (!newWindow) {
        alert('Popup bị chặn. Vui lòng cho phép popup cho trang web này.');
      }
    } catch (error) {
      console.error('Lỗi khi chuyển hướng đến Google Translate:', error);
      // Phương án dự phòng nếu window.open() không hoạt động
      window.location.href = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(document.title)}`;
    }
  };

  if (!mounted) return null;

  // Style nút giống hệt như trong hình ảnh
  return (
    <button
      onClick={handleTranslate}
      type="button"
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span role="img" aria-label="Globe" className="text-base">🌐</span>
      <span>English</span>
    </button>
  );
} 