'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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