'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

// Memoize MainHeader component để tránh re-render không cần thiết
const MainHeader = memo(function MainHeader() {
  // Chỉ log khi môi trường dev
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) console.log('[MainHeader] Rendering')
  
  // Sử dụng destructuring với useSession
  const { data: session, status } = useSession()
  if (isDev) console.log('[MainHeader] Session status:', status, 'User:', session?.user?.name || 'No user')
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  
  // State cho authentication
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  
  // Theo dõi và cập nhật authentication state
  useEffect(() => {
    try {
      if (status === 'loading') {
        setIsLoading(true)
        setIsAuthenticated(false)
      } else if (status === 'authenticated' && session?.user) {
        setIsLoading(false)
        setIsAuthenticated(true)
        setUserName(session.user.name || session.user.email || 'User')
      } else {
        setIsLoading(false)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('[MainHeader] Error in authentication effect:', error)
      setIsLoading(false)
      setIsAuthenticated(false)
    }
  }, [status, session])
  
  // Đóng menu khi thay đổi URL
  useEffect(() => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState)
  }, [])
  
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prevState => !prevState)
  }, [])
  
  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('[MainHeader] Error signing out:', error)
    }
  }, [])
  
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 border-b border-gray-100">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/images/logo.svg"
                alt="XLab Logo"
                width={120}
                height={40}
                priority
                className="h-8 w-auto"
                onError={(e) => {
                  console.error('[MainHeader] Error loading logo image')
                  e.currentTarget.onerror = null // Tránh lặp vô hạn
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSIxMCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSI+WExhYiBMb2dvPC90ZXh0Pjwvc3ZnPg==' // Fallback SVG
                }}
              />
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/services" className={`px-3 py-2 text-sm font-medium ${pathname === '/services' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
                Dịch vụ
              </Link>
              <Link href="/products" className={`px-3 py-2 text-sm font-medium ${pathname === '/products' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
                Sản phẩm
              </Link>
              <Link href="/blog" className={`px-3 py-2 text-sm font-medium ${pathname === '/blog' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
                Blog
              </Link>
              <Link href="/about" className={`px-3 py-2 text-sm font-medium ${pathname === '/about' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
                Về chúng tôi
              </Link>
              <Link href="/contact" className={`px-3 py-2 text-sm font-medium ${pathname === '/contact' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
                Liên hệ
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-sm focus:outline-none"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Mở menu người dùng</span>
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-gray-700">{userName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Đăng nhập
                </Link>
                <Link href="/register" className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Đóng menu' : 'Mở menu'}</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/services" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/services' ? 'text-primary-600 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
              Dịch vụ
            </Link>
            <Link href="/products" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/products' ? 'text-primary-600 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
              Sản phẩm
            </Link>
            <Link href="/blog" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/blog' ? 'text-primary-600 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
              Blog
            </Link>
            <Link href="/about" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/about' ? 'text-primary-600 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
              Về chúng tôi
            </Link>
            <Link href="/contact" className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === '/contact' ? 'text-primary-600 bg-gray-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
              Liên hệ
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoading ? (
              <div className="flex items-center px-4 py-2">
                <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse"></div>
                <div className="ml-3 h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center px-4 py-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">{userName}</div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 px-2 space-y-1">
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  Đăng nhập
                </Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 hover:bg-primary-700 text-white">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
})

export default MainHeader 