'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              XLab
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-primary-600 font-medium">
              Sản phẩm
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-primary-600 font-medium">
              Dịch vụ
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary-600 font-medium">
              Bảng giá
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-primary-600 font-medium">
              Hỗ trợ
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium">
              Về chúng tôi
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/contact" className="btn btn-primary">
              Liên hệ
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            type="button"
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-3">
            <Link
              href="/products"
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Sản phẩm
            </Link>
            <Link
              href="/services"
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Dịch vụ
            </Link>
            <Link
              href="/pricing"
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Bảng giá
            </Link>
            <Link
              href="/support"
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Hỗ trợ
            </Link>
            <Link
              href="/about"
              className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Về chúng tôi
            </Link>
            <Link
              href="/contact"
              className="block py-2 px-4 text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Liên hệ
            </Link>
          </div>
        )}
      </div>
    </header>
  )
} 