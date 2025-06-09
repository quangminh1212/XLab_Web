'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = '' }: LanguageSwitcherProps) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors ${className}`}
    >
      <span className="mr-1">🌐</span>
      {t('nav.language')}
    </button>
  );
};

export default LanguageSwitcher; 