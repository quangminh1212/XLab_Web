'use client';

import { useEffect, useState } from 'react';

export default function DirectEnglishLink() {
  const [mounted, setMounted] = useState(false);
  const [translateUrl, setTranslateUrl] = useState('');
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      // Tạo URL Google Translate trực tiếp
      setTranslateUrl(`https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(currentUrl)}`);
    }
  }, []);

  if (!mounted) return null;
  
  // Sử dụng thẻ <a> thay vì <button> để đảm bảo hoạt động ngay cả khi JavaScript bị lỗi
  return (
    <a
      href={translateUrl}
      id="direct-english-link"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
      aria-label="Translate to English"
    >
      <span className="text-base">🌐</span>
      <span>English</span>
    </a>
  );
} 