'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { LanguageKeys } from '@/locales';

interface LanguageSwitcherProps {
  className?: string;
}

// Map of language codes to display names and flag paths
const languageMap: Record<string, { name: string, flagPath: string }> = {
  'vie': { name: 'Tiếng Việt', flagPath: '/images/flags/vn.svg' },
  'eng': { name: 'English', flagPath: '/images/flags/gb.svg' },
  'spa': { name: 'Español', flagPath: '/images/flags/es.svg' }
};

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
<<<<<<< HEAD
  const { language, setLanguage, availableLanguages } = useLanguage();
=======
  const { language, setLanguage, isClient } = useLanguage();
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdown to close dropdown
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

<<<<<<< HEAD
<<<<<<< HEAD
  const changeLanguage = (lang: LanguageKeys) => {
=======
  const changeLanguage = (lang: 'vie' | 'eng') => {
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
=======
  const changeLanguage = (lang: 'vie' | 'eng') => {
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
    setLanguage(lang);
    setIsOpen(false);
  };

<<<<<<< HEAD
  // Get current language display info
  const currentLang = languageMap[language] || { name: language, flagPath: '/images/flags/gb.svg' };
=======
  // Always render the default language UI on server for hydration matching
  if (!isClient) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1 rounded-md border border-transparent hover:border-gray-200"
          aria-expanded={false}
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
          <span>VIE</span>
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
      </div>
    );
  }
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1 rounded-md border border-transparent hover:border-gray-200"
        aria-expanded={isOpen}
      >
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="relative w-6 h-4 mr-2">
          <Image 
            src={currentLang.flagPath} 
            alt={currentLang.name} 
            width={24}
            height={16}
            className="object-cover rounded-sm"
          />
        </div>
        <span>{currentLang.name}</span>
=======
=======
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
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
            <span>VIE</span>
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
            <span>ENG</span>
          </>
        )}
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
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
<<<<<<< HEAD
        <div className="absolute right-0 mt-2 py-1 w-40 bg-white rounded-md shadow-lg z-20 border border-gray-200">
          {availableLanguages.map((lang) => {
            const langInfo = languageMap[lang] || { name: lang, flagPath: '/images/flags/gb.svg' };
            
            return (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${language === lang ? 'bg-gray-100' : ''}`}
              >
                <div className="relative w-6 h-4 mr-2">
                  <Image 
                    src={langInfo.flagPath}
                    alt={langInfo.name}
                    width={24}
                    height={16}
                    className="object-cover rounded-sm"
                  />
                </div>
                <span>{langInfo.name}</span>
              </button>
            );
          })}
=======
        <div className="absolute right-0 mt-2 py-1 w-28 bg-white rounded-md shadow-lg z-20 border border-gray-200">
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
            <span>VIE</span>
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
            <span>ENG</span>
          </button>
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 