'use client';

import { useEffect, useState } from 'react';

export default function HtmlEnglishLink() {
  const [mounted, setMounted] = useState(false);
  const [translateUrl, setTranslateUrl] = useState('');
  
  useEffect(() => {
    setMounted(true);
    // Tạo URL khi component được mount để đảm bảo có window.location
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      setTranslateUrl(`https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(currentUrl)}`);
    }
  }, []);
  
  if (!mounted) return null;
  
  return (
    <a
      href={translateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span className="text-base">🌐</span>
      <span>English</span>
    </a>
  );
} 