'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { siteConfig } from '@/config/siteConfig'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status, update } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)

  // Thêm useEffect để force refresh session khi component mount
  useEffect(() => {
    const refreshSession = async () => {
      try {
        // Đặt timeout để tránh chờ quá lâu
        const updatePromise = update();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session update timeout')), 2000)
        );
        
        await Promise.race([updatePromise, timeoutPromise]);
        console.log("Session refreshed successfully:", status, session);
      } catch (error) {
        console.error("Failed to refresh session:", error);
      } finally {
        // Đánh dấu đã kiểm tra session
        setSessionChecked(true);
      }
    };
    
    refreshSession();
    
    // Fallback: đảm bảo luôn đánh dấu là đã kiểm tra sau 3 giây
    const timeout = setTimeout(() => {
      if (!sessionChecked) {
        console.log("Session check timeout reached, forcing UI update");
        setSessionChecked(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [update, session, status, sessionChecked]);

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
    // Đóng menu user khi mở mobile menu
    if (!mobileMenuOpen) {
      setUserMenuOpen(false)
    }
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
    // Đóng mobile menu khi mở menu user
    if (!userMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    setUserMenuOpen(false) // Đóng menu trước khi đăng xuất
    
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback nếu signOut thất bại
      router.push('/');
      router.refresh();
    }
  }

  const isLoading = status === 'loading' && !sessionChecked
  const isAuthenticated = status === 'authenticated' && !!session

  // Debugging session state
  useEffect(() => {
    console.log("Auth state updated:", {
      status,
      sessionChecked,
      isAuthenticated: status === 'authenticated' && !!session,
      sessionExists: !!session,
      user: session?.user
    });
  }, [status, session, sessionChecked]);

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
                <span className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full shadow-sm text-center">
                  {greeting}, {session.user.name?.split(' ')[0] || 'bạn'}!
                </span>
              </div>
            )}
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center justify-center space-x-2">
            <Link href="/" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/70'}`}>
              Trang chủ
            </Link>
            <Link href="/accounts" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname.startsWith('/products') || pathname.startsWith('/accounts') ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/70'}`}>
              Sản phẩm
            </Link>
            <Link href="/services" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/services' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/70'}`}>
              Dịch vụ
            </Link>
            <Link href="/about" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/about' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/70'}`}>
              Giới thiệu
            </Link>
            <Link href="/contact" className={`px-4 py-2 rounded-md transition-colors font-medium text-center ${pathname === '/contact' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/70'}`}>
              Liên hệ
            </Link>
          </nav>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-3">
            {/* Tìm kiếm */}
            <button
              className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-primary-50/80 transition-colors flex items-center justify-center"
              aria-label="Tìm kiếm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isLoading ? (
              // Loading indicator khi đang kiểm tra phiên đăng nhập
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-teal-500 rounded-full border-t-transparent"></div>
              </div>
            ) : isAuthenticated && session ? (
              <div className="flex items-center justify-center space-x-3">
                {/* Thông báo */}
                <button
                  className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-primary-50/80 transition-colors relative flex items-center justify-center"
                  aria-label="Thông báo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center justify-center space-x-2 focus:outline-none p-1 rounded-full border-2 border-transparent hover:border-primary-300 transition-all"
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
                      <div className="w-9 h-9 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
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

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black/5 z-50">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b text-center">
                        Đăng nhập bằng {session.user?.email}
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 text-center">
                        Tài khoản của tôi
                      </Link>
                      <Link href="/account/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 text-center">
                        Cài đặt
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
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
                  className="px-5 py-2 border border-primary-500 text-primary-600 rounded-full hover:bg-primary-50 hover:shadow-sm transition-all font-medium text-center"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 hover:shadow-md transition-all font-medium text-center"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center"
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
            {isAuthenticated && session && (
              <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md text-center">
                {greeting}, {session.user?.name?.split(' ')[0] || 'bạn'}!
              </div>
            )}
            <Link href="/" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`}>
              Trang chủ
            </Link>
            <Link href="/accounts" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname.startsWith('/products') || pathname.startsWith('/accounts') ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`}>
              Sản phẩm
            </Link>
            <Link href="/services" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/services' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`}>
              Dịch vụ
            </Link>
            <Link href="/about" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/about' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`}>
              Giới thiệu
            </Link>
            <Link href="/contact" className={`block px-4 py-2.5 text-base font-medium rounded-md text-center ${pathname === '/contact' ? 'text-primary-600 bg-primary-50 shadow-sm' : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'}`}>
              Liên hệ
            </Link>

            {!isLoading && !isAuthenticated && (
              <div className="flex space-x-3 mt-3 px-3">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2.5 border border-primary-500 text-primary-600 rounded-full text-center hover:bg-primary-50 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-full text-center hover:bg-primary-600 transition-colors font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
            
            {isAuthenticated && session && (
              <button
                onClick={handleSignOut}
                className="w-full mt-3 px-4 py-2.5 text-red-600 rounded-full text-center hover:bg-red-50 transition-colors font-medium border border-red-200"
              >
                Đăng xuất
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 