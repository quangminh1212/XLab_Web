import Link from 'next/link';
import { useState } from 'react';
import UserMenu from './UserMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-teal-600 hover:text-teal-800">
                XLab
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Trang chủ
              </Link>
              <Link 
                href="/san-pham" 
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Sản phẩm
              </Link>
              <Link 
                href="/dich-vu" 
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dịch vụ
              </Link>
              <Link 
                href="/gioi-thieu" 
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Giới thiệu
              </Link>
              <Link 
                href="/lien-he" 
                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Liên hệ
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <UserMenu />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Mở menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Trang chủ
          </Link>
          <Link 
            href="/san-pham" 
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Sản phẩm
          </Link>
          <Link 
            href="/dich-vu" 
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Dịch vụ
          </Link>
          <Link 
            href="/gioi-thieu" 
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Giới thiệu
          </Link>
          <Link 
            href="/lien-he" 
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-teal-500 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Liên hệ
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 