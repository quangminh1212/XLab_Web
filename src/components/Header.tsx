import React, { useState } from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-primary">XLab</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <span className="text-gray-600 hover:text-primary transition-colors">Trang chủ</span>
            </Link>
            <Link href="/research">
              <span className="text-gray-600 hover:text-primary transition-colors">Nghiên cứu</span>
            </Link>
            <Link href="/community">
              <span className="text-gray-600 hover:text-primary transition-colors">Cộng đồng</span>
            </Link>
            <Link href="/analytics">
              <span className="text-gray-600 hover:text-primary transition-colors">Phân tích</span>
            </Link>
            <Link href="/about">
              <span className="text-gray-600 hover:text-primary transition-colors">Giới thiệu</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-primary focus:outline-none"
            >
              <svg
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
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/">
                <span className="text-gray-600 hover:text-primary transition-colors">Trang chủ</span>
              </Link>
              <Link href="/research">
                <span className="text-gray-600 hover:text-primary transition-colors">Nghiên cứu</span>
              </Link>
              <Link href="/community">
                <span className="text-gray-600 hover:text-primary transition-colors">Cộng đồng</span>
              </Link>
              <Link href="/analytics">
                <span className="text-gray-600 hover:text-primary transition-colors">Phân tích</span>
              </Link>
              <Link href="/about">
                <span className="text-gray-600 hover:text-primary transition-colors">Giới thiệu</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 