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
    <>
      {/* Mobile */}
      <div className="md:hidden flex items-center">
        {isVi ? (
          <button
            onClick={() => changeLanguage('en')}
            className="flex items-center px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <span>{t('language.vietnamese')}</span>
          </button>
        ) : (
          <button
            onClick={() => changeLanguage('vi')}
            className="flex items-center px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            <span>{t('language.english')}</span>
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-center">
        <div className="flex items-center space-x-1 border border-gray-200 rounded-md">
          <button
            onClick={() => changeLanguage('vi')}
            className={`flex items-center px-2 py-1 text-xs rounded-l ${
              isVi
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors`}
          >
            <span>{t('language.vietnamese')}</span>
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`flex items-center px-2 py-1 text-xs rounded-r ${
              !isVi
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            } transition-colors`}
          >
            <span>{t('language.english')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default LanguageSwitcher; 