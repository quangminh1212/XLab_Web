'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function MainHeader() {
  console.log('[MainHeader] Rendering')
  
  // Sử dụng destructuring với useSession
  const { data: session, status } = useSession()
  console.log('[MainHeader] Session status:', status, 'User:', session?.user?.name || 'No user')
  
  // Log chi tiết về session cho debugging
  useEffect(() => {
    try {
      console.log('[MainHeader] Session debug - Status:', status)
      console.log('[MainHeader] Session debug - Session object:', JSON.stringify({
        data: session ? {
          user: session.user ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email?.substring(0, 3) + '...',
            image: !!session.user.image,
          } : null,
          expires: session.expires,
        } : null,
        status
      }, null, 2))
    } catch (error) {
      console.error('[MainHeader] Error logging session details:', error)
    }
  }, [session, status])
  
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
      console.log('[MainHeader] useEffect running, status:', status)
      
      if (status === 'loading') {
        console.log('[MainHeader] Status is loading - waiting for session')
        setIsLoading(true)
        setIsAuthenticated(false)
      } else if (status === 'authenticated' && session?.user) {
        console.log('[MainHeader] Status is authenticated - with valid user')
        setIsLoading(false)
        setIsAuthenticated(true)
        setUserName(session.user.name || session.user.email || 'User')
        console.log('[MainHeader] Authenticated as:', session.user.name || session.user.email)
      } else {
        console.log('[MainHeader] Status is:', status, '- no valid session')
        setIsLoading(false)
        setIsAuthenticated(false)
        console.log('[MainHeader] Not authenticated')
      }
    } catch (error) {
      console.error('[MainHeader] Error in authentication effect:', error)
      // Log stack trace nếu có
      if (error instanceof Error) {
        console.error('[MainHeader] Error stack:', error.stack)
      }
      setIsLoading(false)
      setIsAuthenticated(false)
    }
  }, [status, session])
  
  // Đóng menu khi thay đổi URL
  useEffect(() => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])
  
  const toggleMenu = () => {
    console.log('[MainHeader] Toggling menu to:', !isMenuOpen)
    setIsMenuOpen(!isMenuOpen)
  }
  
  const toggleDropdown = () => {
    console.log('[MainHeader] Toggling dropdown to:', !isDropdownOpen)
    setIsDropdownOpen(!isDropdownOpen)
  }
  
  const handleSignOut = async () => {
    try {
      console.log('[MainHeader] Signing out...')
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('[MainHeader] Error signing out:', error)
      // Log stack trace nếu có
      if (error instanceof Error) {
        console.error('[MainHeader] Error stack:', error.stack)
      }
    }
  }
  
  // Log thông tin rendering
  console.log('[MainHeader] Render state:', { 
    isLoading, 
    isAuthenticated, 
    userName: userName || 'None',
    pathname,
    menuOpen: isMenuOpen,
    dropdownOpen: isDropdownOpen
  })
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt="XLab Logo"
                  width={120}
                  height={40}
                  priority
                  className="h-10 w-auto"
                  onError={(e) => {
                    console.error('[MainHeader] Error loading logo image')
                    e.currentTarget.onerror = null // Tránh lặp vô hạn
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSIxMCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSI+WExhYiBMb2dvPC90ZXh0Pjwvc3ZnPg==' // Fallback SVG
                  }}
                />
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/services" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/services' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Dịch vụ
              </Link>
              <Link href="/blog" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/blog' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Blog
              </Link>
              <Link href="/about" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/about' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Về chúng tôi
              </Link>
              <Link href="/contact" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/contact' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Liên hệ
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="ml-3 relative">
                <div>
                  <button 
                    onClick={toggleDropdown}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">Mở menu người dùng</span>
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      {userName}
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100">
                  Đăng nhập
                </Link>
                <Link href="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/services" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/services' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Dịch vụ
            </Link>
            <Link href="/blog" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/blog' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Blog
            </Link>
            <Link href="/about" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/about' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Về chúng tôi
            </Link>
            <Link href="/contact" className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/contact' ? 'border-primary-500 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Liên hệ
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoading ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="mt-1 h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{userName}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link href="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1">
                <Link href="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Đăng nhập
                </Link>
                <Link href="/register" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
} 