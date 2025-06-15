'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames } from '@/i18n/config';
import Image from 'next/image';
import Cookies from 'js-cookie';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Get current locale from pathname
  const currentLocale = locales.find(locale => 
    pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  ) || 'vi';

  // Flag images for each locale
  const flags = {
    vi: '/images/flags/vi.svg',
    en: '/images/flags/en.svg',
  };

  const handleLocaleChange = (newLocale: string) => {
    // Close dropdown
    setIsOpen(false);

    // Save locale in cookie
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });

    // Create new path with new locale
    const newPath = pathname.replace(new RegExp(`^/(${locales.join('|')})`), `/${newLocale}`);
    
    // Navigate to new path
    router.push(newPath);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-md p-1.5 transition-colors hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image 
          src={flags[currentLocale as keyof typeof flags]} 
          alt={localeNames[currentLocale as keyof typeof localeNames]} 
          width={20} 
          height={20} 
        />
        <span className="text-sm font-medium hidden md:block">
          {localeNames[currentLocale as keyof typeof localeNames]}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                  locale === currentLocale ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } hover:bg-gray-100`}
                onClick={() => handleLocaleChange(locale)}
              >
                <Image 
                  src={flags[locale as keyof typeof flags]} 
                  alt={localeNames[locale]} 
                  width={20} 
                  height={20} 
                />
                {localeNames[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 