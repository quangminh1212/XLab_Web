'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage, t } = useLanguage();
  const isVi = language === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mark component as mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    if (!isMounted) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMounted]);

  const changeLanguage = (lang: 'vi' | 'en') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors cursor-pointer"
        onClick={isMounted ? () => setIsOpen(!isOpen) : undefined}
      >
        <div className="relative w-6 h-4 mr-2">
          {isMounted ? (
            <Image
              src={`/images/flags/${isVi ? 'vn' : 'us'}.svg`}
              alt={isVi ? 'Tiếng Việt' : 'English'}
              width={24}
              height={16}
              className="object-cover rounded-sm"
            />
          ) : (
            <div className="w-6 h-4 bg-gray-100 rounded-sm"></div>
          )}
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
      </div>

      {isMounted && isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <div
                onClick={() => changeLanguage('vi')}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                } cursor-pointer`}
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
                onClick={() => changeLanguage('en')}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  !isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                } cursor-pointer`}
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

export default LanguageSwitcher; 