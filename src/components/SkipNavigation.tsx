'use client'

import React from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function SkipNavigation() {
  const { t } = useLanguage()
  
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-teal-600 focus:text-white focus:z-50"
    >
      {t('skipNavigation')}
    </a>
  )
} 