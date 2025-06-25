'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentLanguage, setCurrentLanguage] = useState<string>('vie');

  useEffect(() => {
    // Get the current language from URL or localStorage
    const langParam = searchParams.get('lang');
    if (langParam) {
      setCurrentLanguage(langParam);
      localStorage.setItem('preferredLanguage', langParam);
    } else {
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang) {
        setCurrentLanguage(savedLang);
      }
    }
  }, [searchParams]);

  const handleLanguageChange = (lang: string) => {
    // Save the selected language
    localStorage.setItem('preferredLanguage', lang);
    setCurrentLanguage(lang);

    // Create new URL with updated language parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', lang);
    
    // Navigate to the same page with the new language
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('vie')}>
          <span>Tiếng Việt</span>
          {currentLanguage === 'vie' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('eng')}>
          <span>English</span>
          {currentLanguage === 'eng' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher; 