'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useNotifications } from '@/contexts/NotificationContext';

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  // Sử dụng NotificationContext
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isOpen) setIsOpen(false);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isOpen) setIsOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container max-w-[99.5%] mx-auto py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/images/logo.jpg"
                alt="XLab Logo"
                width={120}
                height={72}
                className="w-auto h-14 md:h-16"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors text-base lg:text-lg tracking-wide font-medium`}>
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`${isActive('/products')} transition-colors text-base lg:text-lg tracking-wide font-medium`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/services"
              className={`${isActive('/services')} transition-colors text-base lg:text-lg tracking-wide font-medium`}
            >
              Dịch vụ
            </Link>
            <Link
              href="/testimonials"
              className={`${isActive('/testimonials')} transition-colors text-base lg:text-lg tracking-wide font-medium`}
            >
              Đánh giá
            </Link>
            <Link
              href="/about"
              className={`${isActive('/about')} transition-colors text-base lg:text-lg tracking-wide font-medium`}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className={`${isActive('/contact')} transition-colors text-base lg:text-lg tracking-wide font-medium`}
            >
              Liên hệ
            </Link>
            <Link
              href="/bao-hanh"
              className={`${isActive('/bao-hanh')} transition-colors text-base lg:text-lg tracking-wide font-medium`}
            >
              Bảo hành
            </Link>
          </nav>

          {/* Right Side - Auth + Cart */}
          <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
            {/* Notification Icon */}
            {session && (
              <div className="relative">
                <button
                  onClick={toggleNotification}
                  className="text-gray-700 hover:text-primary-600 focus:outline-none relative"
                  aria-label="Thông báo"
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-72 sm:w-80 md:w-96 bg-white rounded-lg shadow-xl py-3 z-10">
                    <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-sm sm:text-base text-primary-600 hover:text-primary-800"
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-50' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm sm:text-base font-medium text-gray-900">{notification.title}</h4>
                              <span className="text-xs sm:text-sm text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-5 py-8 text-center">
                          <p className="text-sm sm:text-base text-gray-500">Không có thông báo nào</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-5 py-3 border-t border-gray-100 text-center">
                      <Link
                        href="/notifications"
                        className="text-sm sm:text-base text-primary-600 hover:text-primary-800"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                    width={36}
                    height={36}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full"
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
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-lg text-sm md:text-lg tracking-wide font-medium transition-colors"
                >
                  Đăng nhập
                </button>
              )}

              {/* Profile Dropdown */}
              {isProfileOpen && session && (
                <div className="absolute right-0 mt-3 w-56 md:w-60 bg-white rounded-lg shadow-xl py-3 z-10">
                  <div className="px-5 py-3 border-b border-gray-100">
                    <p className="text-base md:text-lg font-semibold">{session.user?.name}</p>
                    <p className="text-sm md:text-base text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="block px-5 py-3 text-gray-700 hover:bg-gray-100 text-sm md:text-lg"
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-5 py-3 text-gray-700 hover:bg-gray-100 text-sm md:text-lg"
                  >
                    Đơn hàng của tôi
                  </Link>
                  {/* Admin link if user has admin role */}
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-5 py-3 text-gray-700 hover:bg-gray-100 text-sm md:text-lg"
                    >
                      Quản trị viên
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-100 text-sm md:text-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
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
        {isOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-200">
            <Link
              href="/"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              href="/services"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Dịch vụ
            </Link>
            <Link
              href="/testimonials"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Đánh giá
            </Link>
            <Link
              href="/about"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Liên hệ
            </Link>
            <Link
              href="/bao-hanh"
              className="block py-3 px-4 text-lg font-medium hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Bảo hành
            </Link>
            {!session && (
              <div className="mt-3 px-4">
                <button
                  onClick={() => {
                    signIn();
                    setIsOpen(false);
                  }}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg text-lg tracking-wide font-medium transition-colors"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 