'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { LanguageKeys } from '@/locales';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage, availableLanguages } = useLanguage();
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

  const changeLanguage = (lang: LanguageKeys) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1 rounded-md border border-transparent hover:border-gray-200"
        aria-expanded={isOpen}
      >
        {language === 'vie' ? (
          <>
            <div className="relative w-6 h-4 mr-2">
              <Image 
                src="/images/flags/vn.svg" 
                alt="Tiếng Việt" 
                width={24}
                height={16}
                className="object-cover rounded-sm"
              />
            </div>
            <span>Tiếng Việt</span>
          </>
        ) : (
          <>
            <div className="relative w-6 h-4 mr-2">
              <Image 
                src="/images/flags/gb.svg" 
                alt="English" 
                width={24}
                height={16}
                className="object-cover rounded-sm"
              />
            </div>
            <span>English</span>
          </>
        )}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 ml-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-1 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          <button
            onClick={() => changeLanguage('vie')}
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${language === 'vie' ? 'bg-gray-100' : ''}`}
          >
            <div className="relative w-6 h-4 mr-2">
              <Image 
                src="/images/flags/vn.svg" 
                alt="Tiếng Việt" 
                width={24}
                height={16}
                className="object-cover rounded-sm"
              />
            </div>
            <span>Tiếng Việt</span>
          </button>
          <button
            onClick={() => changeLanguage('eng')}
            className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${language === 'eng' ? 'bg-gray-100' : ''}`}
          >
            <div className="relative w-6 h-4 mr-2">
              <Image 
                src="/images/flags/gb.svg" 
                alt="English" 
                width={24}
                height={16}
                className="object-cover rounded-sm"
              />
            </div>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 