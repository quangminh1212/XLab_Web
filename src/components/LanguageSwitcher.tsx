'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/i18n';

// Định nghĩa các component UI đơn giản thay vì import từ thư viện bên ngoài
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: string; 
  size?: string; 
  className?: string; 
  [key: string]: any 
}) => {
  return (
    <button 
      className={`px-4 py-2 rounded-md flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Globe icon component
const Globe = ({ className = '' }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

// Check icon component
const Check = ({ className = '' }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    // Sử dụng context để thay đổi ngôn ngữ
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 px-0 bg-transparent hover:bg-gray-100 rounded-full"
      >
        <Globe className="h-4 w-4" />
        <span className="sr-only">Toggle language</span>
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
              onClick={() => handleLanguageChange('vie')}
            >
              <span>Tiếng Việt</span>
              {language === 'vie' && <Check className="ml-2 h-4 w-4" />}
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
              onClick={() => handleLanguageChange('eng')}
            >
              <span>English</span>
              {language === 'eng' && <Check className="ml-2 h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 