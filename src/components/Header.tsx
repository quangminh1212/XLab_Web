import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              XLab
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="font-medium">
              Products
            </Link>
            <Link href="/services" className="font-medium">
              Services
            </Link>
            <Link href="/pricing" className="font-medium">
              Pricing
            </Link>
            <Link href="/about" className="font-medium">
              About
            </Link>
            <Link href="/contact" className="font-medium">
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
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
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/products" className="font-medium">
                Products
              </Link>
              <Link href="/services" className="font-medium">
                Services
              </Link>
              <Link href="/pricing" className="font-medium">
                Pricing
              </Link>
              <Link href="/about" className="font-medium">
                About
              </Link>
              <Link href="/contact" className="font-medium">
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
} 