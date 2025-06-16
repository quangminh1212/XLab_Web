'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function SimpleLanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [isVi, setIsVi] = useState(false); // Initialize without value to prevent hydration mismatch
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Set initial state after component mounts on client
    setIsMounted(true);
    setIsVi(language === 'vi');
    
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [language]);
  
  // Don't render anything during server-side rendering or initial client render
  if (!isMounted) {
    return <div className="mr-2 relative" ref={containerRef}></div>;
  }
  
  return (
    <div className="mr-2 relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
      >
        <div className="relative w-6 h-4 mr-2">
          <Image
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
              <div
                onClick={() => {
                  setLanguage('vi');
                  setIsVi(true);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm cursor-pointer ${
                  isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setLanguage('vi');
                    setIsVi(true);
                    setIsOpen(false);
                  }
                }}
              >
                <div className="relative w-6 h-4 mr-3">
                  <Image
                    src="/images/flags/vn.svg"
                    alt="Tiếng Việt"
                    width={24}
                    height={16}
                    className="object-cover rounded-sm"
                  />
                </div>
                <span>{t('language.vietnamese')}</span>
              </div>
            </li>
            <li>
              <div
                onClick={() => {
                  setLanguage('en');
                  setIsVi(false);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm cursor-pointer ${
                  !isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setLanguage('en');
                    setIsVi(false);
                    setIsOpen(false);
                  }
                }}
              >
                <div className="relative w-6 h-4 mr-3">
                  <Image
                    src="/images/flags/us.svg"
                    alt="English"
                    width={24}
                    height={16}
                    className="object-cover rounded-sm"
                  />
                </div>
                <span>{t('language.english')}</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
} 