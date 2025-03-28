'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import commonTranslations from '@/translations/common'

type Language = 'vi' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    translate: (key: string) => string
    isLoaded: boolean
}

const defaultValue: LanguageContextType = {
    language: 'vi',
    setLanguage: () => { },
    translate: (key: string) => key,
    isLoaded: false,
}

const LanguageContext = createContext<LanguageContextType>(defaultValue)

export const useLanguage = () => useContext(LanguageContext)

interface LanguageProviderProps {
    children: React.ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>('vi')
    const [translations, setTranslations] = useState<any>(commonTranslations)
    const [isLoaded, setIsLoaded] = useState(true)

    useEffect(() => {
        // Kiểm tra xem localStorage có sẵn không (chỉ làm trên client-side)
        const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') as Language : null

        if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
            setLanguageState(savedLanguage)
        } else {
            // Nếu không có ngôn ngữ lưu trong localStorage, kiểm tra ngôn ngữ trình duyệt
            if (typeof window !== 'undefined' && window.navigator) {
                const browserLang = window.navigator.language.split('-')[0]
                if (browserLang === 'en') {
                    setLanguageState('en')
                    localStorage.setItem('language', 'en')
                }
            }
        }

        // Thêm sự kiện lắng nghe khi language trong localStorage thay đổi từ tab khác
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'language' && e.newValue && (e.newValue === 'vi' || e.newValue === 'en')) {
                setLanguageState(e.newValue as Language)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        
        // Log để debug
        console.log('Translations available in context:', Object.keys(translations).length)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [translations])

    const setLanguage = (lang: Language) => {
        if (lang !== language) {
            setLanguageState(lang)
            if (typeof window !== 'undefined') {
                localStorage.setItem('language', lang)

                // Thêm hoặc cập nhật thuộc tính lang trên thẻ html để hỗ trợ SEO và các công cụ đọc màn hình
                document.documentElement.lang = lang

                // Phát sự kiện tùy chỉnh để thông báo cho các components khác về thay đổi ngôn ngữ
                const event = new CustomEvent('languageChange', { detail: { language: lang } })
                document.dispatchEvent(event)
            }
        }
    }

    const translate = (key: string): string => {
        if (!key) return key

        try {
            // Tách key theo dấu chấm (ví dụ: 'navigation.home')
            const keys = key.split('.')
            let result: any = translations
            
            // Nếu không có bản dịch, trả về key
            if (!translations || Object.keys(translations).length === 0) {
                console.warn(`No translations available for key: ${key}`)
                return key
            }
            
            // Duyệt qua từng phần của key để lấy giá trị
            for (const k of keys) {
                if (!result || typeof result !== 'object' || !(k in result)) {
                    // Nếu không tìm thấy key trong các bản dịch, trả về key gốc
                    console.warn(`Translation not found for key: ${key}`)
                    return key
                }
                result = result[k]
            }
            
            // Nếu kết quả là chuỗi, trả về chuỗi đó
            if (typeof result === 'string') return result
            
            // Nếu kết quả là object có chứa ngôn ngữ hiện tại, trả về giá trị của ngôn ngữ đó
            if (result && typeof result === 'object') {
                if (language in result) {
                    return result[language]
                }
                // Nếu không có ngôn ngữ hiện tại, dùng ngôn ngữ mặc định
                if ('vi' in result) {
                    return result['vi']
                }
            }
            
            // Nếu không tìm thấy bản dịch, trả về key gốc
            console.warn(`Translation structure invalid for key: ${key}`)
            return key
        } catch (error) {
            console.error('Error in translate function:', error)
            return key
        }
    }

    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        translate,
        isLoaded,
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    )
} 