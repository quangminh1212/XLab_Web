'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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
    const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})
    const [isLoaded, setIsLoaded] = useState(false)

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

        // Tải các bản dịch
        const loadTranslations = async () => {
            try {
                const commonTranslations = await import('@/translations/common')
                setTranslations(commonTranslations.default)
                setIsLoaded(true)
            } catch (error) {
                console.error('Không thể tải các bản dịch:', error)
                setIsLoaded(true) // Vẫn đánh dấu là đã tải xong ngay cả khi có lỗi
            }
        }

        loadTranslations()

        // Thêm sự kiện lắng nghe khi language trong localStorage thay đổi từ tab khác
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'language' && e.newValue && (e.newValue === 'vi' || e.newValue === 'en')) {
                setLanguageState(e.newValue as Language)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

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
        if (!isLoaded) return key
        if (!key) return ''

        try {
            // Xử lý key dạng chuỗi đơn (không phải đối tượng lồng)
            // Ví dụ: 'services.pageTitle' và 'services.pageTitle_en'
            const directKey = language === 'en' ? `${key}_en` : key

            // @ts-ignore - Bỏ qua lỗi TypeScript ở đây do chúng ta biết translations là đối tượng
            if (translations[directKey] && typeof translations[directKey] === 'string') {
                // @ts-ignore
                return translations[directKey]
            }

            // Xử lý key dạng đối tượng lồng nhau với vi/en
            const keys = key.split('.')
            let result = { ...translations } as any

            for (let i = 0; i < keys.length - 1; i++) {
                if (result[keys[i]]) {
                    result = result[keys[i]]
                } else {
                    return key // Không tìm thấy khóa trong translations
                }
            }

            const lastKey = keys[keys.length - 1]
            const translatedText = result[lastKey]?.[language]

            return translatedText || key
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