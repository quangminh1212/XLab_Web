'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { siteConfig } from '@/config/siteConfig'
import { useLanguage } from '@/context/LanguageContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    // Xác định lời chào dựa trên thời gian trong ngày
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return language === 'vi' ? t('goodMorning') : t('goodMorning')
      if (hour < 18) return language === 'vi' ? t('goodAfternoon') : t('goodAfternoon')
      return language === 'vi' ? t('goodEvening') : t('goodEvening')
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
  }, [language, t])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen)
  }

  const changeLanguage = (lang: 'vi' | 'en') => {
    setLanguage(lang)
    setLanguageMenuOpen(false)
  }

  const isLoading = status === 'loading'

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-1'
        : 'bg-white/90 backdrop-blur-sm py-2'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="w-20 h-20 inline-flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt={`${siteConfig.name} Logo`}
                  width={70}
                  height={70}
                  className="object-contain rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  priority
                />
              </span>
            </Link>

            {/* Lời chào và tên người dùng trên desktop */}
            {!isLoading && session?.user && (
              <div className="hidden md:flex items-center ml-4 text-sm font-medium text-gray-600">
                <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full shadow-sm text-center">
                  {greeting}, {session.user.name?.split(' ')[0] || t('you')}!
                </span>
              </div>
            )}
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-2">
            <Link href="/" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              {t('home')}
            </Link>
            <Link href="/products" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/products' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              {t('products')}
            </Link>
            <Link href="/services" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/services' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              {t('services')}
            </Link>
            <Link href="/about" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/about' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              {t('about')}
            </Link>
            <Link href="/contact" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/contact' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              {t('contact')}
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-3">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors flex items-center justify-center"
                aria-label={t('selectLanguage')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="ml-1 text-xs font-medium">{language.toUpperCase()}</span>
              </button>
              
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black/5 z-50">
                  <button 
                    onClick={() => changeLanguage('vi')}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'vi' ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-teal-50'}`}
                  >
                    🇻🇳 Tiếng Việt
                  </button>
                  <button 
                    onClick={() => changeLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:bg-teal-50'}`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>
            
            {/* Tìm kiếm */}
            <button
              className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors flex items-center justify-center"
              aria-label={t('search')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {!isLoading && session ? (
              <div className="flex items-center justify-center space-x-3">
                {/* Thông báo */}
                <button
                  className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors relative flex items-center justify-center"
                  aria-label={t('notifications')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleMobileMenu()}
                    className="flex items-center justify-center space-x-2 focus:outline-none p-1 rounded-full border-2 border-transparent hover:border-teal-300 transition-all"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Avatar'}
                        width={36}
                        height={36}
                        className="rounded-full shadow-sm"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="hidden sm:inline-block text-sm font-medium text-gray-700 text-center">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {mobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black/5 z-50">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b text-center">
                        {t('loggedInAs')} {session.user?.email}
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 text-center">
                        {t('myAccount')}
                      </Link>
                      <Link href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 text-center">
                        {t('settings')}
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center justify-center space-x-3">
                <Link
                  href="/login"
                  className="px-5 py-2 border border-teal-500 text-teal-600 rounded-full hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center"
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
            {!isLoading && session && (
              <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md text-center">
                {greeting}, {session.user?.name?.split(' ')[0] || t('you')}!
              </div>
            )}
            <Link href="/" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              {t('home')}
            </Link>
            <Link href="/products" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/products' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              {t('products')}
            </Link>
            <Link href="/services" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/services' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              {t('services')}
            </Link>
            <Link href="/about" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/about' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              {t('about')}
            </Link>
            <Link href="/contact" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/contact' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              {t('contact')}
            </Link>

            {/* Language selector in mobile menu */}
            <div className="flex space-x-2 px-4 py-2">
              <button 
                onClick={() => changeLanguage('vi')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md text-center ${language === 'vi' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 border border-gray-200'}`}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md text-center ${language === 'en' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 border border-gray-200'}`}
              >
                🇬🇧 English
              </button>
            </div>

            {!isLoading && !session && (
              <div className="flex space-x-3 mt-3 px-3">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2.5 border border-teal-500 text-teal-600 rounded-full text-center hover:bg-teal-50 transition-colors font-medium"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2.5 bg-teal-500 text-white rounded-full text-center hover:bg-teal-600 transition-colors font-medium"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 