'use client';

import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import i18nConfig from '../../../next-i18next.config.js';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = '; expires=' + date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentPathname.startsWith(`/${i18n.language}`)
    ) {
        router.push(currentPathname.replace(`/${i18n.language}`, `/${newLocale}`));
    } else {
        router.push(`/${newLocale}${currentPathname}`);
    }

    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleChange('vi')}
        className={`flex items-center p-1 rounded-full transition-transform duration-200 ${i18n.language === 'vi' ? 'ring-2 ring-blue-500 scale-110' : 'hover:scale-110'}`}
        aria-label="Switch to Vietnamese"
      >
        <span className="text-2xl">🇻🇳</span>
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`flex items-center p-1 rounded-full transition-transform duration-200 ${i18n.language === 'en' ? 'ring-2 ring-blue-500 scale-110' : 'hover:scale-110'}`}
        aria-label="Switch to English"
      >
        <span className="text-2xl">🇬🇧</span>
      </button>
    </div>
  );
} 