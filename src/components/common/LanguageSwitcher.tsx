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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click bên ngoài dropdown để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lang: 'vi' | 'en') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-4 mr-2">
          <Image
            src={`/images/flags/${isVi ? 'vn' : 'us'}.svg`}
            alt={isVi ? 'Tiếng Việt' : 'English'}
            width={24}
            height={16}
            className="rounded"
          />
        </div>
        <span className="hidden md:inline">{isVi ? 'Tiếng Việt' : 'English'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button
                onClick={() => changeLanguage('vi')}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative w-6 h-4 mr-3">
                  <Image
                    src="/images/flags/vn.svg"
                    alt="Tiếng Việt"
                    width={24}
                    height={16}
                    className="rounded"
                  />
                </div>
                <span>{t('language.vietnamese')}</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => changeLanguage('en')}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  !isVi ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative w-6 h-4 mr-3">
                  <Image
                    src="/images/flags/us.svg"
                    alt="English"
                    width={24}
                    height={16}
                    className="rounded"
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
};

export default LanguageSwitcher; 