'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-600 flex items-center">
            XLab
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/products"
              className={`text-sm font-medium ${pathname === "/products" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
            >
              Sản phẩm
            </Link>
            <Link 
              href="/services"
              className={`text-sm font-medium ${pathname === "/services" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
            >
              Dịch vụ
            </Link>
            <Link 
              href="/pricing"
              className={`text-sm font-medium ${pathname === "/pricing" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
            >
              Báo giá
            </Link>
            <Link 
              href="/payment"
              className={`text-sm font-medium ${pathname === "/payment" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
            >
              Thanh toán
            </Link>
            <Link 
              href="/blog"
              className={`text-sm font-medium ${pathname === "/blog" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
            >
              Blog
            </Link>
            <Link 
              href="/about"
              className={`text-sm font-medium ${pathname === "/about" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
            >
              Về chúng tôi
            </Link>
          </nav>

          {/* Contact Button - Desktop */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
            >
              Liên hệ
            </Link>
          </div>

          {/* User Profile / Login */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse w-32 h-10 bg-gray-200 rounded-md"></div>
            ) : session ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show initials
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('text-primary-600', 'font-medium');
                          e.currentTarget.parentElement!.textContent = (session.user?.name?.charAt(0) || 'U').toUpperCase();
                        }}
                      />
                    ) : (
                      <span className="text-primary-600 font-medium">
                        {(session.user?.name?.charAt(0) || 'U').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                    {session.user?.name || 'Người dùng'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-2">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">
                      Tài khoản
                    </Link>
                    <Link href="/account#licenses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">
                      Giấy phép
                    </Link>
                    <Link href="/account#orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50">
                      Đơn hàng
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition-colors"
              >
                Đăng nhập
              </Link>
            )}
            <Link
              href="/cart"
              className="inline-flex items-center justify-center p-2 text-primary-500 bg-primary-50 rounded-full hover:bg-primary-100 relative transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary-800 hover:text-primary-600"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
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

        {/* Mobile Menu */}
        <div className={`fixed inset-0 z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out p-5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-primary-600">XLab</span>
              <button 
                onClick={toggleMobileMenu} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {session ? (
                <div className="p-3 bg-primary-50 rounded-lg mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || 'User'} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('text-primary-600', 'font-medium');
                            e.currentTarget.parentElement!.textContent = (session.user?.name?.charAt(0) || 'U').toUpperCase();
                          }}
                        />
                      ) : (
                        <span className="text-primary-600 font-medium">
                          {(session.user?.name?.charAt(0) || 'U').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 truncate max-w-[170px]">
                        {session.user?.name || 'Người dùng'}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[170px]">
                        {session.user?.email || ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      href="/account" 
                      className="flex-1 text-xs text-center py-1 bg-white rounded border border-gray-200 text-primary-600"
                      onClick={toggleMobileMenu}
                    >
                      Tài khoản
                    </Link>
                    <button 
                      onClick={() => { signOut(); toggleMobileMenu(); }}
                      className="flex-1 text-xs text-center py-1 bg-white rounded border border-gray-200 text-red-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 mb-6">
                  <Link 
                    href="/login"
                    className="w-full py-2 bg-primary-500 text-white text-center rounded-md"
                    onClick={toggleMobileMenu}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/register"
                    className="w-full py-2 bg-white border border-primary-500 text-primary-500 text-center rounded-md"
                    onClick={toggleMobileMenu}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
              
              <Link 
                href="/" 
                className={`block py-2 px-3 rounded-md ${pathname === "/" ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={toggleMobileMenu}
              >
                Trang chủ
              </Link>
              <Link 
                href="/products" 
                className={`block py-2 px-3 rounded-md ${pathname === "/products" ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={toggleMobileMenu}
              >
                Sản phẩm
              </Link>
              <Link 
                href="/services" 
                className={`block py-2 px-3 rounded-md ${pathname === "/services" ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={toggleMobileMenu}
              >
                Dịch vụ
              </Link>
              <Link 
                href="/pricing" 
                className={`block py-2 px-3 rounded-md ${pathname === "/pricing" ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={toggleMobileMenu}
              >
                Bảng giá
              </Link>
              <Link 
                href="/support" 
                className={`block py-2 px-3 rounded-md ${pathname === "/support" ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={toggleMobileMenu}
              >
                Hỗ trợ
              </Link>
              <Link 
                href="/cart" 
                className={`block py-2 px-3 rounded-md flex items-center justify-between ${pathname === "/cart" ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-100"}`}
                onClick={toggleMobileMenu}
              >
                <span>Giỏ hàng</span>
                <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 px-5">
              <div className="text-xs text-gray-500 text-center">
                &copy; {new Date().getFullYear()} XLab
                <br />
                Tất cả quyền được bảo lưu
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 