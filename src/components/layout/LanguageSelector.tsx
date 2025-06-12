'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Đóng dropdown khi click bên ngoài
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

  const languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '/images/flags/vn.svg', shortname: 'VIE' },
    { code: 'en', name: 'English', flag: '/images/flags/gb.svg', shortname: 'ENG' },
    { code: 'es', name: 'Español', flag: '/images/flags/es.svg', shortname: 'ESP' }
  ];

  const handleLanguageChange = (langCode: 'vi' | 'en' | 'es') => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1 rounded-md border border-transparent hover:border-gray-200"
        aria-expanded={isOpen}
      >
        <div className="relative w-6 h-4 mr-2">
          <Image 
            src={currentLanguage.flag} 
            alt={currentLanguage.name} 
            width={24}
            height={16}
            className="object-cover rounded-sm"
          />
        </div>
        <span>{currentLanguage.shortname}</span>
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
        <div className="absolute right-0 mt-2 py-1 w-28 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'vi' | 'en' | 'es')}
              className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${language === lang.code ? 'bg-gray-100' : ''}`}
            >
              <div className="relative w-6 h-4 mr-2">
                <Image 
                  src={lang.flag} 
                  alt={lang.name} 
                  width={24}
                  height={16}
                  className="object-cover rounded-sm"
                />
              </div>
              <span>{lang.shortname}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 