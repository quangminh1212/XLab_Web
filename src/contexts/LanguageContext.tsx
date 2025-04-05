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
    const [isMounted, setIsMounted] = useState(false)

    // Đánh dấu component đã mount để tránh sử dụng window/document khi chưa hydrate
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Khởi tạo ngôn ngữ từ localStorage hoặc ngôn ngữ trình duyệt
    useEffect(() => {
        // Chỉ thực hiện khi ở client side và component đã mount
        if (typeof window === 'undefined' || !isMounted) {
            return;
        }

        try {
            // Đánh dấu là đã tải
            setIsLoaded(true)

            // Kiểm tra localStorage
            try {
                const savedLanguage = localStorage.getItem('language')
                
                if (savedLanguage === 'en' || savedLanguage === 'vi') {
                    setLanguageState(savedLanguage as Language)
                    
                    // Đảm bảo ngôn ngữ được thiết lập trên thẻ html
                    if (document?.documentElement) {
                        document.documentElement.lang = savedLanguage
                    }
                } else {
                    // Nếu không có ngôn ngữ lưu trong localStorage, kiểm tra ngôn ngữ trình duyệt
                    const browserLang = window.navigator.language.split('-')[0]

                    if (browserLang === 'en') {
                        setLanguageState('en')
                        localStorage.setItem('language', 'en')
                        if (document?.documentElement) {
                            document.documentElement.lang = 'en'
                        }
                    } else {
                        // Đặt mặc định là tiếng Việt và lưu vào localStorage
                        setLanguageState('vi')
                        localStorage.setItem('language', 'vi')
                        if (document?.documentElement) {
                            document.documentElement.lang = 'vi'
                        }
                    }
                }
            } catch (storageError) {
                console.error('Error accessing localStorage:', storageError)
                setLanguageState('vi')
            }
        } catch (error) {
            console.error('Error initializing language:', error)
            // Đảm bảo luôn có ngôn ngữ mặc định
            setLanguageState('vi')
        }
    }, [isMounted])

    // Theo dõi thay đổi từ tab khác
    useEffect(() => {
        // Chỉ thực hiện khi ở client side và component đã mount
        if (typeof window === 'undefined' || !isMounted) {
            return;
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'language' && e.newValue && (e.newValue === 'vi' || e.newValue === 'en')) {
                setLanguageState(e.newValue as Language)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [isMounted])

    const setLanguage = (lang: Language) => {
        // Chỉ thực hiện khi ở client side và component đã mount
        if (typeof window === 'undefined' || !isMounted) {
            return;
        }

        if (lang !== language) {
            try {
                // Đảm bảo update localStorage trước
                try {
                    localStorage.setItem('language', lang);
                } catch (err) {
                    console.error('Error updating localStorage:', err);
                }

                // Cập nhật thuộc tính lang trên thẻ html
                if (document?.documentElement) {
                    document.documentElement.lang = lang
                }

                // Cập nhật state sau khi đã xử lý localStorage
                setLanguageState(lang)

                // Phát sự kiện thay đổi ngôn ngữ
                if (document) {
                    const event = new CustomEvent('languageChange', { detail: { language: lang } })
                    document.dispatchEvent(event)
                }
            } catch (error) {
                console.error('Error in setLanguage:', error)
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
                return key
            }

            // Duyệt qua từng phần của key để lấy giá trị
            for (const k of keys) {
                if (!result || typeof result !== 'object' || !(k in result)) {
                    // Nếu không tìm thấy key trong các bản dịch, trả về key gốc
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