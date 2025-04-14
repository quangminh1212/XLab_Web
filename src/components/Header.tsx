'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/siteConfig'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

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
          </div>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname === '/' ? 'text-teal-600' : 'text-gray-700'
                }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname === '/products' || pathname.startsWith('/products/') ? 'text-teal-600' : 'text-gray-700'
                }`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname === '/pricing' ? 'text-teal-600' : 'text-gray-700'
                }`}
            >
              Bảng giá
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname === '/about' ? 'text-teal-600' : 'text-gray-700'
                }`}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname === '/contact' ? 'text-teal-600' : 'text-gray-700'
                }`}
            >
              Liên hệ
            </Link>
          </nav>

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

            <div className="hidden sm:flex items-center justify-center space-x-3">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full border-2 border-t-teal-500 animate-spin"></div>
              ) : session ? (
                <>
                  <Link
                    href="/account"
                    className="relative group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-100 hover:border-teal-300 transition-all">
                      <Image
                        src={session.user?.image || "/images/avatar-placeholder.png"}
                        alt={session.user?.name || "Tài khoản"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 min-w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {session.user?.name || "Tài khoản"}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 border border-red-400 text-red-500 rounded-full hover:bg-red-50 hover:shadow-sm transition-all font-medium text-center"
                  >
                    Đăng xuất
                  </button>
                  {session.user?.email === 'xlab.rnd@gmail.com' && (
                    <Link
                      href="/admin"
                      className="px-5 py-2 border border-teal-500 text-teal-600 rounded-full hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center"
                    >
                      Quản trị
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => signIn('google')}
                    className="px-5 py-2 border border-teal-500 text-teal-600 rounded-full hover:bg-teal-50 hover:shadow-sm transition-all font-medium text-center"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
              <Link
                href="/admin/products"
                className="px-5 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:shadow-md transition-all font-medium text-center"
              >
                Quản lý sản phẩm
              </Link>
            </div>

            {/* Hamburger menu for mobile */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-teal-50/80"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-200 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/"
                className={`px-4 py-2 text-center rounded-md ${pathname === '/' ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                onClick={toggleMobileMenu}
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className={`px-4 py-2 text-center rounded-md ${pathname === '/products' || pathname.startsWith('/products/') ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                onClick={toggleMobileMenu}
              >
                Sản phẩm
              </Link>
              <Link
                href="/pricing"
                className={`px-4 py-2 text-center rounded-md ${pathname === '/pricing' ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                onClick={toggleMobileMenu}
              >
                Bảng giá
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 text-center rounded-md ${pathname === '/about' ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                onClick={toggleMobileMenu}
              >
                Giới thiệu
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 text-center rounded-md ${pathname === '/contact' ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                onClick={toggleMobileMenu}
              >
                Liên hệ
              </Link>
              
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-t-teal-500 animate-spin"></div>
                </div>
              ) : session ? (
                <>
                  <div className="flex items-center justify-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-100">
                      <Image
                        src={session.user?.image || "/images/avatar-placeholder.png"}
                        alt={session.user?.name || "Tài khoản"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 border border-red-400 text-red-500 rounded-md text-center"
                  >
                    Đăng xuất
                  </button>
                  {session.user?.email === 'xlab.rnd@gmail.com' && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 bg-teal-50 text-teal-600 rounded-md text-center"
                      onClick={toggleMobileMenu}
                    >
                      Quản trị
                    </Link>
                  )}
                </>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="px-4 py-2 border border-teal-500 text-teal-600 rounded-md text-center"
                >
                  Đăng nhập
                </button>
              )}
              
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-teal-500 text-white rounded-md text-center"
                onClick={toggleMobileMenu}
              >
                Quản lý sản phẩm
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 