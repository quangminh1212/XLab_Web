'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [language, setLanguage] = useState('vi') // 'vi' for Vietnamese, 'en' for English
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Xác định lời chào dựa trên thời gian trong ngày và ngôn ngữ
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (language === 'vi') {
        if (hour < 12) return 'Chào buổi sáng'
        if (hour < 18) return 'Chào buổi chiều'
        return 'Chào buổi tối'
      } else {
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
      }
    }

    setGreeting(getGreeting())

    // Kiểm tra scroll để thay đổi style header
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [language])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (languageMenuOpen) setLanguageMenuOpen(false)
  }

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen)
  }

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    setLanguageMenuOpen(false)
  }

  // Translations for menu items
  const translations = {
    vi: {
      home: 'Trang chủ',
      products: 'Sản phẩm',
      services: 'Dịch vụ',
      blog: 'Blog',
      about: 'Giới thiệu',
      contact: 'Liên hệ',
      login: 'Đăng nhập',
      register: 'Đăng ký',
      account: 'Tài khoản của tôi',
      settings: 'Cài đặt',
      logout: 'Đăng xuất',
      loggedInAs: 'Đăng nhập bằng'
    },
    en: {
      home: 'Home',
      products: 'Products',
      services: 'Services',
      blog: 'Blog',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      account: 'My Account',
      settings: 'Settings',
      logout: 'Logout',
      loggedInAs: 'Logged in as'
    }
  }

  const t = translations[language as keyof typeof translations]

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-primary-50 to-secondary-50 py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                X
              </div>
              <span className="font-bold text-xl text-primary-700 hidden sm:inline-block">XLab</span>
            </Link>
            
            {/* Lời chào và tên người dùng trên desktop */}
            {session?.user && (
              <div className="hidden md:flex items-center ml-4 text-sm font-medium text-gray-600">
                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                  {greeting}, {session.user.name?.split(' ')[0] || (language === 'vi' ? 'bạn' : 'you')}!
                </span>
              </div>
            )}
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              {t.home}
            </Link>
            <Link href="/products" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              {t.products}
            </Link>
            <Link href="/services" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              {t.services}
            </Link>
            <Link href="/blog" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              {t.blog}
            </Link>
            <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              {t.about}
            </Link>
            <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
              {t.contact}
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={toggleLanguageMenu}
                className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-primary-50 flex items-center"
                aria-label="Change language"
              >
                <span className="text-sm font-medium mr-1 hidden sm:inline-block">
                  {language === 'vi' ? 'VI' : 'EN'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  <button
                    onClick={() => changeLanguage('vi')}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'vi' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Tìm kiếm */}
            <button 
              className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-primary-50"
              aria-label="Tìm kiếm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {session ? (
              <div className="flex items-center space-x-2">
                {/* Thông báo */}
                <button 
                  className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-primary-50 relative"
                  aria-label="Thông báo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => toggleMobileMenu()}
                    className="flex items-center space-x-2 focus:outline-none p-1 rounded-full border-2 border-transparent hover:border-primary-300"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Avatar'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="hidden sm:inline-block text-sm text-gray-700">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        {t.loggedInAs} {session.user?.email}
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">
                        {t.account}
                      </Link>
                      <Link href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">
                        {t.settings}
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        {t.logout}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 border border-primary-500 text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
                >
                  {t.login}
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                  {t.register}
                </Link>
              </div>
            )}

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-3 space-y-1 border-t mt-2">
            {session && (
              <div className="px-4 py-2 text-sm font-medium text-gray-600">
                {greeting}, {session.user?.name?.split(' ')[0] || (language === 'vi' ? 'bạn' : 'you')}!
              </div>
            )}
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
              {t.home}
            </Link>
            <Link href="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
              {t.products}
            </Link>
            <Link href="/services" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
              {t.services}
            </Link>
            <Link href="/blog" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
              {t.blog}
            </Link>
            <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
              {t.about}
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md">
              {t.contact}
            </Link>
            
            {/* Language switcher in mobile view */}
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-sm text-gray-600">{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => changeLanguage('vi')}
                  className={`px-2 py-1 text-sm rounded ${language === 'vi' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600'}`}
                >
                  VI
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-1 text-sm rounded ${language === 'en' ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600'}`}
                >
                  EN
                </button>
              </div>
            </div>
            
            {!session && (
              <div className="flex space-x-2 mt-2 px-3">
                <Link 
                  href="/login" 
                  className="flex-1 px-4 py-2 border border-primary-500 text-primary-600 rounded-full text-center hover:bg-primary-50 transition-colors"
                >
                  {t.login}
                </Link>
                <Link 
                  href="/register" 
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-full text-center hover:bg-primary-600 transition-colors"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 