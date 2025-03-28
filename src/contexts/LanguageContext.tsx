'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'vi' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    translate: (key: string) => string
}

const defaultValue: LanguageContextType = {
    language: 'vi',
    setLanguage: () => { },
    translate: (key: string) => key,
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
        }

        // Tải các bản dịch
        const loadTranslations = async () => {
            try {
                const commonTranslations = await import('@/translations/common')
                setTranslations(commonTranslations.default)
            } catch (error) {
                console.error('Không thể tải các bản dịch:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadTranslations()
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', lang)
        }
    }

    const translate = (key: string): string => {
        if (!isLoaded) return key
        const keys = key.split('.')
        let result = { ...translations }

        for (let i = 0; i < keys.length - 1; i++) {
            if (result[keys[i]]) {
                result = result[keys[i]] as any
            } else {
                return key
            }
        }

        const lastKey = keys[keys.length - 1]
        const translatedText = result[lastKey]?.[language]

        return translatedText || key
    }

    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        translate,
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    )
} 