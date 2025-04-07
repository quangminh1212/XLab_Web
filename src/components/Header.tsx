'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
// import { useSession, signOut } from 'next-auth/react'
import { siteConfig } from '@/config/siteConfig'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  // Tạm thời vô hiệu hóa useSession
  // const { data: session, status } = useSession()
  const session = null // Giả lập không có session
  const isLoading = false // Giả lập không loading
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const { language, translate, isLoaded } = useLanguage()

  useEffect(() => {
    // Xác định lời chào dựa trên thời gian trong ngày
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
  }

  // Danh sách menu dựa theo ngôn ngữ
  const menuItems = [
    { path: '/', label: isLoaded ? translate('navigation.home') : 'Home' },
    { path: '/products', label: isLoaded ? translate('navigation.products') : 'Products' },
    { path: '/services', label: isLoaded ? translate('navigation.services') : 'Services' },
    { path: '/about', label: isLoaded ? translate('navigation.about') : 'About' },
    { path: '/contact', label: isLoaded ? translate('navigation.contact') : 'Contact' }
  ]

  const uiText = {
    login: isLoaded ? translate('navigation.login') : 'Login',
    register: isLoaded ? translate('navigation.register') : 'Register',
    myAccount: isLoaded ? translate('navigation.myAccount') : 'My Account',
    settings: isLoaded ? translate('navigation.settings') : 'Settings',
    logout: isLoaded ? translate('navigation.logout') : 'Logout',
    loggedInAs: isLoaded ? translate('navigation.loggedInAs') : 'Logged in as'
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              XLab
            </Link>
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-medium ${pathname === item.path ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <span className="font-medium">EN</span>
            </div>

            {/* Search Icon */}
            <div className="hidden sm:flex">
              <button
                className="text-gray-600 hover:text-teal-600"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Login/Register buttons */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-teal-600 font-medium hover:text-teal-700"
              >
                {uiText.login}
              </Link>
              <Link
                href="/register"
                className="bg-teal-500 text-white px-4 py-2 rounded font-medium hover:bg-teal-600"
              >
                {uiText.register}
              </Link>
            </div>

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden text-gray-600 hover:text-teal-600"
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
          <div className="md:hidden py-4 space-y-2 border-t">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`block py-2 text-base font-medium ${pathname === item.path ? 'text-teal-600' : 'text-gray-700 hover:text-teal-600'}`}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex space-x-4 mt-4 pt-4 border-t">
              <Link
                href="/login"
                className="block w-1/2 text-center text-teal-600 font-medium py-2 border border-teal-600 rounded"
              >
                {uiText.login}
              </Link>
              <Link
                href="/register"
                className="block w-1/2 text-center bg-teal-500 text-white font-medium py-2 rounded"
              >
                {uiText.register}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 