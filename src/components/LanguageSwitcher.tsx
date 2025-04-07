'use client'

import { useLanguage } from '@/contexts/LanguageContext'

type LanguageSwitcherProps = {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en')
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`font-medium ${className}`}
    >
      EN
    </button>
  )
} 