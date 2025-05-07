'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { siteConfig } from '@/config/siteConfig'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Xác định lời chào dựa trên thời gian trong ngày
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Chào buổi sáng'
      if (hour < 18) return 'Chào buổi chiều'
      return 'Chào buổi tối'
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
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isLoading = status === 'loading'

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-white py-3'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo và Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-md overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt={`${siteConfig.name} Logo`}
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold">
                <span className="text-blue-600">X</span>
                <span className="text-gray-900">Lab</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <nav className="hidden md:flex space-x-1 flex-1 justify-center">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-md text-base font-medium ${
                pathname === '/' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
              } transition-colors duration-200`}
            >
              Trang chủ
            </Link>
            <Link 
              href="/accounts" 
              className={`px-4 py-2 rounded-md text-base font-medium ${
                pathname && (pathname.startsWith('/products') || pathname.startsWith('/accounts')) 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
              } transition-colors duration-200`}
            >
              Sản phẩm
            </Link>
            <Link 
              href="/services" 
              className={`px-4 py-2 rounded-md text-base font-medium ${
                pathname === '/services' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
              } transition-colors duration-200`}
            >
              Dịch vụ
            </Link>
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-md text-base font-medium ${
                pathname === '/about' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
              } transition-colors duration-200`}
            >
              Giới thiệu
            </Link>
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-md text-base font-medium ${
                pathname === '/contact' 
                  ? 'text-teal-600 bg-teal-50' 
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'
              } transition-colors duration-200`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right-side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" 
                placeholder="Tìm kiếm..."
              />
            </div>

            {/* Mobile search */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50 transition-colors"
              aria-label="Tìm kiếm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {!isLoading && session ? (
              <div className="flex items-center space-x-3">
                {/* Thông báo */}
                <button
                  className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50 transition-colors relative"
                  aria-label="Thông báo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                {/* Giỏ hàng */}
                <Link 
                  href="/cart" 
                  className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50 transition-colors relative"
                  aria-label="Giỏ hàng"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                    2
                  </span>
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <Link href="/account" className="p-0.5 rounded-full border-2 border-transparent hover:border-teal-300 transition-all flex items-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || 'User avatar'}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/images/avatar-placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 transition-colors font-medium text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-medium text-sm shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
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
          <div className="md:hidden py-3 space-y-1 border-t mt-2 bg-white">
            <div className="px-4 py-2 mb-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" 
                  placeholder="Tìm kiếm..."
                />
              </div>
            </div>
            
            <Link href="/" className={`block px-4 py-2 text-base font-medium ${pathname === '/' ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Trang chủ
            </Link>
            <Link href="/accounts" className={`block px-4 py-2 text-base font-medium ${pathname && (pathname.startsWith('/products') || pathname.startsWith('/accounts')) ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Sản phẩm
            </Link>
            <Link href="/services" className={`block px-4 py-2 text-base font-medium ${pathname === '/services' ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Dịch vụ
            </Link>
            <Link href="/about" className={`block px-4 py-2 text-base font-medium ${pathname === '/about' ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Giới thiệu
            </Link>
            <Link href="/contact" className={`block px-4 py-2 text-base font-medium ${pathname === '/contact' ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Liên hệ
            </Link>

            {!isLoading && !session && (
              <div className="flex space-x-2 mt-3 px-4">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2 border border-teal-500 text-teal-600 rounded-md text-center hover:bg-teal-50 transition-colors font-medium text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-md text-center hover:bg-teal-700 transition-colors font-medium text-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {!isLoading && session && (
              <div className="border-t mt-2 pt-2 px-4">
                <div className="flex items-center space-x-3 mb-3">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name || 'User avatar'}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                
                <Link href="/account" className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-md">
                  Tài khoản của tôi
                </Link>
                <Link href="/cart" className="block w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-md">
                  Giỏ hàng
                </Link>
                <button 
                  onClick={() => signOut()} 
                  className="block w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-md mt-1"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 