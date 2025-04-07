'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the available languages
export type Language = 'vi' | 'en'

// Define the context type
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Define translations
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Common
    appName: 'XLab',
    
    // Navigation
    home: 'Trang chủ',
    products: 'Sản phẩm',
    services: 'Dịch vụ',
    about: 'Giới thiệu',
    contact: 'Liên hệ',
    
    // Auth
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    myAccount: 'Tài khoản của tôi',
    settings: 'Cài đặt',
    loggedInAs: 'Đăng nhập bằng',
    
    // Greetings
    goodMorning: 'Chào buổi sáng',
    goodAfternoon: 'Chào buổi chiều',
    goodEvening: 'Chào buổi tối',
    you: 'bạn',
    
    // Actions
    search: 'Tìm kiếm',
    notifications: 'Thông báo',
    selectLanguage: 'Chọn ngôn ngữ',
    
    // Skip navigation
    skipNavigation: 'Bỏ qua phần điều hướng',
  },
  en: {
    // Common
    appName: 'XLab',
    
    // Navigation
    home: 'Home',
    products: 'Products',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    myAccount: 'My Account',
    settings: 'Settings',
    loggedInAs: 'Logged in as',
    
    // Greetings
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    you: 'you',
    
    // Actions
    search: 'Search',
    notifications: 'Notifications',
    selectLanguage: 'Select language',
    
    // Skip navigation
    skipNavigation: 'Skip navigation',
  }
}

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('vi')

  // Initialize language from localStorage or HTML attribute on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    const htmlLang = document.documentElement.getAttribute('data-language') as Language
    
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
    } else if (htmlLang && (htmlLang === 'vi' || htmlLang === 'en')) {
      setLanguageState(htmlLang)
    }
  }, [])

  // Update HTML attribute and localStorage when language changes
  useEffect(() => {
    document.documentElement.setAttribute('data-language', language)
    document.documentElement.setAttribute('lang', language)
    localStorage.setItem('language', language)
  }, [language])

  // Function to set language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 