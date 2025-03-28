'use client'

import React, { useState, useEffect, useRef } from 'react'
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
    const menuRef = useRef<HTMLDivElement>(null)

    const toggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi')
        setShowOptions(false)
    }

    const toggleOptions = () => {
        setShowOptions(!showOptions)
    }

    // Đóng menu khi click bên ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowOptions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className={`relative ${className}`} ref={menuRef}>
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
                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 w-52">
                    <div className="py-1 border border-gray-100 rounded-md">
                        <button
                            onClick={toggleLanguage}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 flex items-center"
                        >
                            <span className="w-6 text-center mr-2 inline-block font-medium">
                                {language === 'vi' ? 'EN' : 'VI'}
                            </span>
                            {translate('actions.switchToEnglish')}
                        </button>

                        {showGoogleTranslate && (
                            <div className="border-t border-gray-100 py-2 px-4">
                                <p className="text-xs text-gray-500 mb-2 font-medium">
                                    {language === 'vi' ? 'Dịch với Google:' : 'Translate with Google:'}
                                </p>
                                <div className="bg-gray-50 p-2 rounded-md">
                                    <GoogleTranslate />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 italic">
                                    {language === 'vi'
                                        ? 'Chọn ngôn ngữ từ danh sách trên để dịch trang web'
                                        : 'Select a language from the list above to translate the website'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
} 