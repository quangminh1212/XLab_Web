'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import GoogleTranslate from './GoogleTranslate'

interface LanguageSwitcherProps {
    className?: string
    showGoogleTranslate?: boolean
}

export default function LanguageSwitcher({
    className = '',
    showGoogleTranslate = true
}: LanguageSwitcherProps) {
    const { language, setLanguage, translate } = useLanguage()
    const [showOptions, setShowOptions] = useState(false)

    const toggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi')
        setShowOptions(false)
    }

    const toggleOptions = () => {
        setShowOptions(!showOptions)
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={toggleOptions}
                className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors flex items-center justify-center"
                aria-label={language === 'vi' ? 'Chuyển đổi ngôn ngữ' : 'Switch language'}
            >
                <div className="flex items-center">
                    <span className="font-medium text-sm mr-1">
                        {language === 'vi' ? 'VI' : 'EN'}
                    </span>
                    <svg
                        className={`h-4 w-4 transition-transform ${showOptions ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {showOptions && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 w-48">
                    <div className="py-1 border border-gray-100 rounded-md">
                        <button
                            onClick={toggleLanguage}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                        >
                            {translate('actions.switchToEnglish')}
                        </button>

                        {showGoogleTranslate && (
                            <div className="border-t border-gray-100 py-2 px-4">
                                <p className="text-xs text-gray-500 mb-1">{language === 'vi' ? 'Dịch với Google:' : 'Translate with Google:'}</p>
                                <GoogleTranslate />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
} 