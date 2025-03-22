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

          {/* Authentication Button */}
          {status === 'loading' ? (
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                {session.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'User'} 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden md:inline text-sm">{session.user?.name?.split(' ')[0]}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Tài khoản của tôi
                </Link>
                <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Đơn hàng
                </Link>
                <Link href="/account/downloads" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Tải xuống
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Đăng nhập
            </Link>
          )}

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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/products"
                  className={`block text-sm font-medium ${pathname === "/products" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link 
                  href="/services"
                  className={`block text-sm font-medium ${pathname === "/services" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing"
                  className={`block text-sm font-medium ${pathname === "/services" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Báo giá
                </Link>
              </li>
              <li>
                <Link 
                  href="/payment"
                  className={`block text-sm font-medium ${pathname === "/payment" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Thanh toán
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className={`block text-sm font-medium ${pathname === "/blog" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className={`block text-sm font-medium ${pathname === "/about" ? "text-primary-600" : "text-primary-800 hover:text-primary-600"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="block px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
} 