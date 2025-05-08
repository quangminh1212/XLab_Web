'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isOpen) setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="XLab Logo"
                width={50}
                height={50}
                className="w-10 h-10 rounded-full"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors`}>
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`${isActive('/products')} transition-colors`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/services"
              className={`${isActive('/services')} transition-colors`}
            >
              Dịch vụ
            </Link>
            <Link
              href="/about"
              className={`${isActive('/about')} transition-colors`}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className={`${isActive('/contact')} transition-colors`}
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Side - Auth + Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>

            {/* User Profile */}
            <div className="relative">
              {session ? (
                <button
                  onClick={toggleProfile}
                  className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none"
                >
                  <Image
                    src={session.user?.image || "/images/profiles/default-avatar.png"}
                    alt={session.user?.name || "User"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ml-1 transform ${
                      isProfileOpen ? "rotate-180" : ""
                    } transition-transform`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Đăng nhập
                </button>
              )}

              {/* Profile Dropdown */}
              {isProfileOpen && session && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Tài khoản
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Đơn hàng
                  </Link>
                  {session.user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`${isActive('/')} transition-colors block`}
                onClick={() => setIsOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className={`${isActive('/products')} transition-colors block`}
                onClick={() => setIsOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                href="/services"
                className={`${isActive('/services')} transition-colors block`}
                onClick={() => setIsOpen(false)}
              >
                Dịch vụ
              </Link>
              <Link
                href="/about"
                className={`${isActive('/about')} transition-colors block`}
                onClick={() => setIsOpen(false)}
              >
                Giới thiệu
              </Link>
              <Link
                href="/contact"
                className={`${isActive('/contact')} transition-colors block`}
                onClick={() => setIsOpen(false)}
              >
                Liên hệ
              </Link>
              {!session && (
                <button
                  onClick={() => {
                    signIn();
                    setIsOpen(false);
                  }}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 