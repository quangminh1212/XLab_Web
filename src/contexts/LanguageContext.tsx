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
    const [isLoaded, setIsLoaded] = useState(false)

    // Khởi tạo ngôn ngữ từ localStorage hoặc ngôn ngữ trình duyệt
    useEffect(() => {
        try {
            // Đánh dấu là đã tải
            setIsLoaded(true)

            // Kiểm tra localStorage chỉ ở phía client
            if (typeof window !== 'undefined') {
                // Force đọc từ localStorage mỗi khi component được mount
                const savedLanguage = localStorage.getItem('language')
                console.log('Saved language from localStorage:', savedLanguage)

                if (savedLanguage === 'en' || savedLanguage === 'vi') {
                    console.log('Setting language from localStorage:', savedLanguage)
                    setLanguageState(savedLanguage as Language)
                    // Đảm bảo ngôn ngữ được thiết lập trên thẻ html
                    document.documentElement.lang = savedLanguage
                } else {
                    // Nếu không có ngôn ngữ lưu trong localStorage, kiểm tra ngôn ngữ trình duyệt
                    const browserLang = window.navigator.language.split('-')[0]
                    console.log('Browser language:', browserLang)

                    if (browserLang === 'en') {
                        console.log('Setting language to English from browser')
                        setLanguageState('en')
                        localStorage.setItem('language', 'en')
                        document.documentElement.lang = 'en'
                    } else {
                        // Đặt mặc định là tiếng Việt và lưu vào localStorage
                        console.log('Setting default language to Vietnamese')
                        setLanguageState('vi')
                        localStorage.setItem('language', 'vi')
                        document.documentElement.lang = 'vi'
                    }
                }
            }
        } catch (error) {
            console.error('Error initializing language:', error)
            // Đảm bảo luôn có ngôn ngữ mặc định
            setLanguageState('vi')
        }
    }, [])

    // Theo dõi thay đổi từ tab khác
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'language' && e.newValue && (e.newValue === 'vi' || e.newValue === 'en')) {
                console.log('Language changed from another tab:', e.newValue)
                setLanguageState(e.newValue as Language)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        console.log('Call to setLanguage with:', lang, 'Current language:', language)

        if (lang !== language) {
            console.log('Changing language to:', lang)

            try {
                // Đảm bảo update localStorage trước
                if (typeof window !== 'undefined') {
                    try {
                        window.localStorage.clear(); // Xóa tất cả để đảm bảo không có xung đột
                        window.localStorage.setItem('language', lang);
                        console.log('localStorage after update:', window.localStorage.getItem('language'));
                    } catch (err) {
                        console.error('Error updating localStorage:', err);
                    }

                    // Cập nhật thuộc tính lang trên thẻ html
                    document.documentElement.lang = lang
                    console.log('HTML lang attribute set to:', document.documentElement.lang)
                }

                // Cập nhật state sau khi đã xử lý localStorage
                setLanguageState(lang)

                // Phát sự kiện thay đổi ngôn ngữ
                if (typeof window !== 'undefined' && document) {
                    const event = new CustomEvent('languageChange', { detail: { language: lang } })
                    document.dispatchEvent(event)
                }
            } catch (error) {
                console.error('Error in setLanguage:', error)
            }
        } else {
            console.log('Language is already', lang, '- no change needed')
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