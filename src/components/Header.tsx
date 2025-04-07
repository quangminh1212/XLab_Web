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
<<<<<<< HEAD
  // Tạm thời vô hiệu hóa useSession
  // const { data: session, status } = useSession()
  const session = null // Giả lập không có session
  const isLoading = false // Giả lập không loading
=======
  
  // Auth đang được vô hiệu hóa tạm thời để khắc phục lỗi
  const isLoading = false
  const session = null  // Giả lập không có session
  
>>>>>>> parent of ce6908a (Merge branch 'main' of https://github.com/quangminh1212/XLab_Web)
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
    { path: '/', label: isLoaded ? translate('navigation.home') : 'Trang chủ' },
    { path: '/products', label: isLoaded ? translate('navigation.products') : 'Sản phẩm' },
    { path: '/services', label: isLoaded ? translate('navigation.services') : 'Dịch vụ' },
    { path: '/about', label: isLoaded ? translate('navigation.about') : 'Giới thiệu' },
    { path: '/contact', label: isLoaded ? translate('navigation.contact') : 'Liên hệ' }
  ]

  const uiText = {
    login: isLoaded ? translate('navigation.login') : 'Đăng nhập',
    register: isLoaded ? translate('navigation.register') : 'Đăng ký',
    myAccount: isLoaded ? translate('navigation.myAccount') : 'Tài khoản của tôi',
    settings: isLoaded ? translate('navigation.settings') : 'Cài đặt',
    logout: isLoaded ? translate('navigation.logout') : 'Đăng xuất',
    loggedInAs: isLoaded ? translate('navigation.loggedInAs') : 'Đăng nhập bằng'
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-md py-1'
        : 'bg-white/90 backdrop-blur-sm py-2'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-gray-800">X</span>
                <span className="text-teal-600">Lab</span>
              </span>
            </Link>
<<<<<<< HEAD

            {/* Lời chào và tên người dùng trên desktop */}
            {/* Bỏ hiển thị lời chào khi chưa có session */}
            {/* {!isLoading && session?.user && (
              <div className="hidden md:flex items-center ml-4 text-sm font-medium text-gray-600">
                <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full shadow-sm text-center">
                  {greeting}, {session.user.name?.split(' ')[0] || (language === 'vi' ? 'bạn' : 'you')}!
                </span>
              </div>
            )} */}
=======
>>>>>>> parent of ce6908a (Merge branch 'main' of https://github.com/quangminh1212/XLab_Web)
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-1 shrink-0">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === item.path ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-3 shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Tìm kiếm */}
            <button
              className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors flex items-center justify-center"
              aria-label={translate('actions.search.vi')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

<<<<<<< HEAD
            {/* {!isLoading && session ? ( */}
            {/* Tạm thời ẩn phần user dropdown và thông báo */}
            {/* <div className="flex items-center justify-center space-x-3"> */}
              {/* ... (nội dung dropdown) ... */}
            {/* </div> */}
            {/* ) : ( */}
=======
            {/* Hiển thị nút đăng nhập/đăng ký */}
>>>>>>> parent of ce6908a (Merge branch 'main' of https://github.com/quangminh1212/XLab_Web)
            <div className="hidden sm:flex items-center justify-center space-x-3 overflow-hidden">
              <Link
                href="/login"
                className="px-3.5 py-1.5 border border-teal-500 text-teal-600 rounded-full hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center whitespace-nowrap text-sm min-w-[90px]"
              >
                {uiText.login}
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center whitespace-nowrap text-sm min-w-[90px]"
              >
                {uiText.register}
              </Link>
            </div>

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
<<<<<<< HEAD
            {/* Bỏ hiển thị lời chào mobile */}
            {/* {!isLoading && session && (
              <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md text-center">
                {greeting}, {session.user?.name?.split(' ')[0] || (language === 'vi' ? 'bạn' : 'you')}!
              </div>
            )} */}

=======
>>>>>>> parent of ce6908a (Merge branch 'main' of https://github.com/quangminh1212/XLab_Web)
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === item.path ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}
              >
                {item.label}
              </Link>
            ))}

            {/* Ngôn ngữ (mobile) */}
            <LanguageSwitcher className="w-full flex justify-center items-center" />

<<<<<<< HEAD
            {/* {!isLoading && !session && ( */}
            {/* Luôn hiển thị nút login/register khi session là null */}
             <div className="flex space-x-3 mt-3 px-3">
              <Link
                href="/login"
                className="flex-1 px-4 py-2 border border-teal-500 text-teal-600 rounded-full text-center hover:bg-teal-50 transition-colors font-medium text-sm min-w-[100px]"
=======
            {/* Auth trên mobile */}
            <div className="flex space-x-3 mt-3 px-3">
              <Link
                href="/login"
                className="flex-1 py-2.5 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center"
>>>>>>> parent of ce6908a (Merge branch 'main' of https://github.com/quangminh1212/XLab_Web)
              >
                {uiText.login}
              </Link>
              <Link
                href="/register"
<<<<<<< HEAD
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-full text-center hover:bg-teal-600 transition-colors font-medium text-sm min-w-[100px]"
              >
                {uiText.register}
              </Link>
             </div>
            {/* )} */}
=======
                className="flex-1 py-2.5 bg-teal-500 text-white rounded-md hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center"
              >
                {uiText.register}
              </Link>
            </div>
>>>>>>> parent of ce6908a (Merge branch 'main' of https://github.com/quangminh1212/XLab_Web)
          </div>
        )}
      </div>
    </header>
  )
} 