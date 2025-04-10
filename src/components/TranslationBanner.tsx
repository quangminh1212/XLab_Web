'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/context/TranslationContext';

interface TranslationBannerProps {
  className?: string;
}

export default function TranslationBanner({ className = '' }: TranslationBannerProps) {
  const pathname = usePathname();
  const { showBanner, hideBanner, setTranslated } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Kiểm tra nếu URL hiện tại chứa translate.googleusercontent.com
    // điều này chỉ ra rằng trang đang được hiển thị qua Google Translate
    if (typeof window !== 'undefined') {
      if (window.location.hostname.includes('translate.googleusercontent.com')) {
        setTranslated(true);
      }
    }
  }, []);
  
  const handleSwitchToEnglish = () => {
    // Redirect to Google's translated version of the page - miễn phí
    const currentUrl = window.location.href;
    setTranslated(true);
    window.location.href = `https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(currentUrl)}`;
  };

  if (!mounted || !showBanner) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex items-center justify-between ${className} z-50`}>
      <div className="flex items-center text-sm text-gray-700">
        <img src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg" alt="Google" className="h-5 mr-2" />
        <span>Trang này có thể được dịch bởi Google Translate.</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSwitchToEnglish}
          className="rounded-full border border-gray-300 px-4 py-1 text-sm font-medium hover:bg-gray-50"
        >
          Switch to English
        </button>
        <button
          onClick={hideBanner}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
} 