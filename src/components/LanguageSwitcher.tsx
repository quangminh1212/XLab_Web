'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface LanguageSwitcherProps {
    className?: string
}

export default function LanguageSwitcher({
    className = ''
}: LanguageSwitcherProps) {
    const { language, setLanguage, translate } = useLanguage()
    const menuRef = useRef<HTMLDivElement>(null)

    // Chuyển đổi ngôn ngữ giữa vi và en
    const toggleLanguage = () => {
        const newLang = language === 'vi' ? 'en' : 'vi'
        console.log('Switching language from', language, 'to', newLang)

        // Lưu trực tiếp vào localStorage trước khi setLanguage
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', newLang)
            console.log('Language saved to localStorage:', newLang)
        }

        // Thiết lập ngôn ngữ qua context
        setLanguage(newLang)
    }

    // Debug language status
    useEffect(() => {
        const debugLanguage = () => {
            console.log('=== LANGUAGE STATUS ===')
            console.log('Current language in context:', language)
            console.log('Current language in localStorage:', localStorage.getItem('language'))
            console.log('Current lang attribute:', document.documentElement.lang)
            console.log('=====================')
        }

        debugLanguage()

        // Thêm event listener để debug khi ngôn ngữ thay đổi
        const handleLanguageChange = () => debugLanguage()
        document.addEventListener('languageChange', handleLanguageChange)

        return () => {
            document.removeEventListener('languageChange', handleLanguageChange)
        }
    }, [language])

    // Hiển thị ngôn ngữ hiện tại
    const currentLanguageDisplay = language === 'vi' ? 'VI' : 'EN'
    // Hiển thị ngôn ngữ đích để chuyển đổi
    const targetLanguageDisplay = language === 'vi' ? 'EN' : 'VI'

    return (
        <div className={`${className}`} ref={menuRef}>
            <button
                onClick={toggleLanguage}
                className="px-2 py-1 text-gray-600 hover:text-teal-600 rounded hover:bg-teal-50/80 transition-colors flex items-center justify-center"
                aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
            >
                <span className="font-medium text-sm">
                    {currentLanguageDisplay}
                </span>
                <svg className="h-4 w-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10m-10 4h10" />
                </svg>
            </button>
        </div>
    )
} 