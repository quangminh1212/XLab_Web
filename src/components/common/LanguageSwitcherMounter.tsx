'use client';

import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  language: string;
  setLanguage: (lang: 'en' | 'vi') => void;
  t: (key: string, params?: any) => string;
}

// This component will be rendered safely
function LanguageSwitcher({ language, setLanguage, t }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const isVi = language === 'vi';
  
  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-4 mr-2">
          <img
            src={`/images/flags/${isVi ? 'vn' : 'us'}.svg`}
            alt={isVi ? 'Tiếng Việt' : 'English'}
            width={24}
            height={16}
            className="object-cover rounded-sm"
          />
        </div>
        <span>{isVi ? 'VIE' : 'ENG'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  setLanguage('vi');
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm text-left cursor-pointer ${
                  isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative w-6 h-4 mr-3">
                  <img
                    src="/images/flags/vn.svg"
                    alt="Tiếng Việt"
                    width={24}
                    height={16}
                    className="object-cover rounded-sm"
                  />
                </div>
                <span>{t('language.vietnamese')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm text-left cursor-pointer ${
                  !isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative w-6 h-4 mr-3">
                  <img
                    src="/images/flags/us.svg"
                    alt="English"
                    width={24}
                    height={16}
                    className="object-cover rounded-sm"
                  />
                </div>
                <span>{t('language.english')}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// This component mounts LanguageSwitcher into DOM after hydration
export default function LanguageSwitcherMounter(): React.ReactNode {
  const languageContext = useLanguage();
  
  useEffect(() => {
    // Find the mount point
    const mountPoint = document.getElementById('language-switcher-mount-point');
    
    if (mountPoint) {
      // Create a root and render the language switcher
      const root = createRoot(mountPoint);
      root.render(
        <LanguageSwitcher 
          language={languageContext.language}
          setLanguage={languageContext.setLanguage}
          t={languageContext.t}
        />
      );
    }
  }, [languageContext]);
  
  // This component doesn't render anything directly
  return null;
} 