'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useCart } from '@/components/cart/CartContext';
import BalanceDisplay from '@/components/common/BalanceDisplay';
import Avatar from '@/components/common/Avatar';

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  
  // Lấy thông tin giỏ hàng
  const { itemCount } = useCart();
  
  // Tạo ref để tham chiếu đến phần tử dropdown profile
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Sử dụng NotificationContext
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Xử lý đóng dropdown khi click bên ngoài
  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Đóng profile dropdown khi click ra ngoài
    if (
      isProfileOpen && 
      profileRef.current && 
      profileButtonRef.current &&
      !profileRef.current.contains(event.target as Node) && 
      !profileButtonRef.current.contains(event.target as Node)
    ) {
      setIsProfileOpen(false);
    }
    
    // Đóng notification dropdown khi click ra ngoài
    if (
      isNotificationOpen && 
      notificationRef.current && 
      !notificationRef.current.contains(event.target as Node)
    ) {
      setIsNotificationOpen(false);
    }
  }, [isProfileOpen, isNotificationOpen]);

  // Thêm event listener khi component được mount
  useEffect(() => {
    // Thêm event listener cho document để bắt sự kiện click bên ngoài
    document.addEventListener('mousedown', handleClickOutside);
    
    // Dọn dẹp event listener khi component bị unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Thêm effect để đóng dropdown khi người dùng nhấn Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isProfileOpen) setIsProfileOpen(false);
        if (isNotificationOpen) setIsNotificationOpen(false);
        if (isOpen) setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isProfileOpen, isNotificationOpen, isOpen]);

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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container max-w-[99.5%] mx-auto py-2 sm:py-3 md:py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/images/logo.jpg"
                alt="XLab Logo"
                width={100}
                height={60}
                className="w-auto h-8 sm:h-9 md:h-10 lg:h-11"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 lg:space-x-4 xl:space-x-6">
            <Link href="/" className={`${isActive('/')} transition-colors text-xs md:text-sm lg:text-base tracking-wide font-medium px-2 py-1 rounded-md`}>
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`${isActive('/products')} transition-colors text-xs md:text-sm lg:text-base tracking-wide font-medium px-2 py-1 rounded-md`}
            >
              Sản phẩm
            </Link>
            <Link
              href="/about"
              className={`${isActive('/about')} transition-colors text-xs md:text-sm lg:text-base tracking-wide font-medium px-2 py-1 rounded-md`}
            >
              Giới thiệu
            </Link>
            <Link
              href="/contact"
              className={`${isActive('/contact')} transition-colors text-xs md:text-sm lg:text-base tracking-wide font-medium px-2 py-1 rounded-md`}
            >
              Liên hệ
            </Link>
            <Link
              href="/bao-hanh"
              className={`${isActive('/bao-hanh')} transition-colors text-xs md:text-sm lg:text-base tracking-wide font-medium px-2 py-1 rounded-md`}
            >
              Bảo hành
            </Link>
          </nav>

          {/* Right Side - Balance + Auth + Cart */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            {/* Balance Display */}
            {session && (
              <div className="hidden sm:block">
                <BalanceDisplay />
              </div>
            )}
            
            {/* Notification Icon */}
            {session && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotification}
                  className="text-gray-700 hover:text-primary-600 focus:outline-none relative"
                  aria-label="Thông báo"
                  aria-expanded={isNotificationOpen}
                  aria-haspopup="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
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
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white rounded-lg shadow-xl py-2 z-10" 
                    tabIndex={0}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-base font-semibold text-gray-900">Thông báo</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAllAsRead();
                          }}
                          className="text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-50' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                            role="menuitem"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900">{notification.title}</h4>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{notification.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-xs sm:text-sm text-gray-500">Không có thông báo nào</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                      <Link
                        href="/notifications"
                        className="text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                        onClick={() => setIsNotificationOpen(false)}
                        role="menuitem"
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
                className="h-4 w-4 sm:h-5 sm:w-5"
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
              <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full text-xs">
                {itemCount}
              </span>
            </Link>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              {session ? (
                <button
                  ref={profileButtonRef}
                  onClick={toggleProfile}
                  className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <Avatar
                    src={session.user?.image}
                    alt={session.user?.name || "User"}
                    size="md"
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 ml-1 transform ${
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
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-1 px-2 sm:py-1.5 sm:px-3 rounded-md text-xs sm:text-sm transition-colors"
                >
                  Đăng nhập
                </button>
              )}

              {/* Profile Dropdown */}
              {isProfileOpen && session && (
                <div 
                  className="absolute right-0 mt-2 w-48 md:w-52 bg-white rounded-lg shadow-xl py-2 z-10"
                  tabIndex={0}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm md:text-base font-semibold">{session.user?.name}</p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Tài khoản của tôi
                  </Link>
                  <Link
                    href="/orders/history"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  {/* Admin link if user has admin role */}
                  {session.user?.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Quản trị viên
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                    role="menuitem"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-primary-600 focus:outline-none p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
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
          <nav className="md:hidden mt-2 py-3 border-t border-gray-200 bg-white rounded-b-lg shadow-lg">
            {/* Hiển thị số dư trên mobile nếu đã đăng nhập */}
            {session && (
              <div className="px-4 py-3 mb-2 text-center">
                <BalanceDisplay className="justify-center" />
              </div>
            )}
            
            <Link
              href="/"
              className={`block py-2 px-4 text-base font-medium hover:bg-gray-50 transition-colors ${isActive('/')}`}
              onClick={() => setIsOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className={`block py-2 px-4 text-base font-medium hover:bg-gray-50 transition-colors ${isActive('/products')}`}
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
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg text-lg tracking-wide font-medium transition-colors"
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