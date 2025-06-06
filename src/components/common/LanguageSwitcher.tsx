'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { t, locale, changeLocale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    changeLocale(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{t('app.header.language')}</span>
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu-button">
            <button
              onClick={() => handleLanguageChange('vi')}
              className={`block w-full px-4 py-2 text-left text-sm ${
                locale === 'vi' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="menuitem"
            >
              {t('app.header.language.vi')}
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`block w-full px-4 py-2 text-left text-sm ${
                locale === 'en' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="menuitem"
            >
              {t('app.header.language.en')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 