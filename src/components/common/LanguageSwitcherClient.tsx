'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

interface LanguageSwitcherClientProps {
  className?: string;
}

export default function LanguageSwitcherClient({ className = '' }: LanguageSwitcherClientProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Wait for client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isMounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMounted]);
  
  // Always render the same structure, even when not mounted
  const isVi = isMounted ? language === 'vi' : false;
  
  return (
    <div 
      className={`relative mr-2 ${className}`.trim()} 
      ref={containerRef}
    >
      {isMounted ? (
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
      ) : null}

      {isOpen && isMounted && (
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