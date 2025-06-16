'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  
  // Create paths for each language
  const getLocalizedPathname = (locale: Locale): string => {
    const pathSegments = pathname.split('/');
    
    // Check if the current path already has a locale
    const currentLocaleIndex = locales.findIndex(loc => 
      pathSegments[1] === loc
    );
    
    if (currentLocaleIndex !== -1) {
      // Replace the existing locale
      pathSegments[1] = locale;
    } else {
      // Add the locale at the beginning
      pathSegments.splice(1, 0, locale);
    }
    
    return pathSegments.join('/');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-md p-1 text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Chọn ngôn ngữ</span>
        <span className="text-xs font-medium">{locale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {locales.map((localeOption) => (
              <Link
                key={localeOption}
                href={getLocalizedPathname(localeOption)}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  locale === localeOption ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'
                } hover:bg-gray-50`}
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                {localeNames[localeOption]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 