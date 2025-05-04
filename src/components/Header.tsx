'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { siteConfig } from '@/config/siteConfig'
import { useAuthStatus } from '@/lib/auth'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, session } = useAuthStatus()
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Client-side only effect - sử dụng useEffect để tránh warning hydration
  useEffect(() => {
    setIsMounted(true)
    
    // Xác định lời chào dựa trên thời gian trong ngày
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Chào buổi sáng'
      if (hour < 18) return 'Chào buổi chiều'
      return 'Chào buổi tối'
    }

    setGreeting(getGreeting())

    // Client-side only code
    if (typeof window !== 'undefined') {
      // Kiểm tra scroll để thay đổi style header
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10)
      }

      // Xử lý click ra ngoài để đóng menu
      const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
          setUserMenuOpen(false)
        }
      }

      window.addEventListener('scroll', handleScroll)
      document.addEventListener('mousedown', handleClickOutside)
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen(prev => !prev)
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false })
    router.push('/')
  }, [router])

  // Avoid rendering content that depends on client-side effect before hydration
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 bg-white/95 shadow-sm py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Simple placeholder during SSR */}
          </div>
        </div>
      </header>
    )
  }

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
            {isAuthenticated && session?.user && (
              <div className="hidden md:flex items-center ml-4 text-sm font-medium text-gray-600">
                <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full shadow-sm text-center">
                  {greeting}, {session.user.name?.split(' ')[0] || 'bạn'}!
                </span>
              </div>
            )}
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-2">
            <Link href="/" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              Trang chủ
            </Link>
            <Link href="/products" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/products' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              Sản phẩm
            </Link>
            <Link href="/services" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/services' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              Dịch vụ
            </Link>
            <Link href="/about" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/about' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              Giới thiệu
            </Link>
            <Link href="/contact" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/contact' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50/70'}`}>
              Liên hệ
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-3">
            {/* Tìm kiếm */}
            <button
              className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors flex items-center justify-center"
              aria-label="Tìm kiếm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isAuthenticated && session?.user ? (
              <div className="flex items-center justify-center space-x-3">
                {/* Biểu tượng tài khoản */}
                <Link
                  href="/account?tab=profile"
                  className="hidden sm:flex p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors items-center justify-center"
                  aria-label="Tài khoản của tôi"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </Link>

                {/* Thông báo */}
                <button
                  className="p-2 text-gray-600 hover:text-teal-600 rounded-full hover:bg-teal-50/80 transition-colors relative flex items-center justify-center"
                  aria-label="Thông báo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
                </button>

                {/* User dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center justify-center space-x-1 focus:outline-none p-1 rounded-full border-2 border-transparent hover:border-teal-300 transition-all"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
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
                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black/5 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm text-gray-500">Đăng nhập với</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{session.user?.email}</p>
                      </div>
                      <div className="pt-2">
                        <Link href="/account?tab=profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Tài khoản của tôi
                        </Link>
                        
                        <Link href="/account?tab=orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Đơn hàng của tôi
                        </Link>
                        
                        <Link href="/account?tab=downloads" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Tải xuống
                        </Link>
                        
                        <Link href="/account?tab=licenses" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Giấy phép
                        </Link>
                        
                        <Link href="/account?tab=support" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Hỗ trợ
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 mt-2"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
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
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center"
                >
                  Đăng ký
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
            {isAuthenticated && session?.user && (
              <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md text-center mb-2">
                {greeting}, {session.user?.name?.split(' ')[0] || 'bạn'}!
              </div>
            )}
            <Link href="/" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Trang chủ
            </Link>
            <Link href="/products" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/products' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Sản phẩm
            </Link>
            <Link href="/services" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/services' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Dịch vụ
            </Link>
            <Link href="/about" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/about' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Giới thiệu
            </Link>
            <Link href="/contact" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/contact' ? 'text-teal-600 bg-teal-50 shadow-sm' : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'}`}>
              Liên hệ
            </Link>

            {isAuthenticated && session?.user ? (
              <div className="space-y-1 mt-2">
                <Link href="/account?tab=profile" className="block px-4 py-2.5 text-base font-medium text-teal-600 bg-teal-50 rounded-md text-center">
                  Tài khoản của tôi
                </Link>
                <Link href="/account?tab=orders" className="block px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md text-center">
                  Đơn hàng của tôi
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 rounded-md text-center"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex space-x-3 mt-3 px-3">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2.5 border border-teal-500 text-teal-600 rounded-full text-center hover:bg-teal-50 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2.5 bg-teal-500 text-white rounded-full text-center hover:bg-teal-600 transition-colors font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 