import React from 'react';
import { useRouter } from 'next/router';
import useTranslation from '@/hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locale } = useTranslation();
  
  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'vie', name: 'Tiếng Việt' }
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <select
      value={locale}
      onChange={handleLanguageChange}
      className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm"
      aria-label="Select language"
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher; 