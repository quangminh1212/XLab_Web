'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LanguageSwitcherWrapperProps {
  className?: string;
}

// Component chỉ chạy ở client để tránh hydration mismatch
const LanguageSwitcherWrapper = ({ className = '' }: LanguageSwitcherWrapperProps) => {
  const { language, setLanguage, t } = useLanguage();
  const isVi = language === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // SSR: Return empty div with proper className to match client structure
  if (!mounted) {
    return <div className={className} aria-hidden="true" />;
  }

  // Client-only render
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
        aria-expanded={isOpen}
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
};

export default LanguageSwitcherWrapper; 