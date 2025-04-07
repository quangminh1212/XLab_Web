'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { siteConfig } from '@/config/siteConfig'

export default function Footer() {
  const { translate, isLoaded } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          <p>© {currentYear} XLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 