'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useEffect, useRef, useCallback, useState } from 'react';

import { useCart } from '@/components/cart/CartContext';
import Avatar from '@/components/common/Avatar';
import BalanceDisplay from '@/components/common/BalanceDisplay';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';

// Thêm interface cho voucher
interface PublicCoupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  endDate: string;
  isPublic?: boolean;
  minOrder?: number;
  userLimit?: number;
  userUsage?: {
    current: number;
    limit: number;
  };
}

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [publicCoupons, setPublicCoupons] = useState<PublicCoupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<PublicCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [lastCouponFetch, setLastCouponFetch] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Lấy thông tin giỏ hàng
  const { itemCount } = useCart();

  // Tạo ref để tham chiếu đến phần tử dropdown profile
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const voucherRef = useRef<HTMLDivElement>(null);

  // Sử dụng NotificationContext
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Thêm useEffect để fetch vouchers công khai và vouchers của người dùng
  const fetchCoupons = React.useCallback(async () => {
    try {
      setLoadingCoupons(true);

      // Fetch public coupons for all users
      const publicResponse = await fetch('/api/coupons/public', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      const publicData = await publicResponse.json();

      if (publicData.success && publicData.coupons) {
        setPublicCoupons(publicData.coupons);
      }

      // If user is logged in, fetch their specific vouchers
      if (session?.user) {
        const userResponse = await fetch('/api/user/vouchers', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });
        const userData = await userResponse.json();

        if (userData.success && userData.vouchers) {
          setUserCoupons(userData.vouchers);
        }
      }

      setLastCouponFetch(Date.now());
    } catch (_error) {
      console.error('Error fetching coupons:', _error);
    } finally {
      setLoadingCoupons(false);
    }
  }, [session?.user]);

  useEffect(() => {
    // Chỉ fetch khi voucher dropdown được mở hoặc đã quá 5 phút kể từ lần fetch cuối
    if (isVoucherOpen && (Date.now() - lastCouponFetch > 5 * 60 * 1000 || lastCouponFetch === 0)) {
      fetchCoupons();
    }
  }, [isVoucherOpen, session?.user, lastCouponFetch, fetchCoupons]);

  // Thêm effect để tự động refresh mỗi 5 phút khi dropdown đang mở
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isVoucherOpen) {
      intervalId = setInterval(
        () => {
          fetchCoupons();
        },
        5 * 60 * 1000,
      ); // 5 phút
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVoucherOpen, fetchCoupons]);

  // Thêm effect để refresh khi tab được kích hoạt lại
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isVoucherOpen) {
        fetchCoupons();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVoucherOpen, fetchCoupons]);

  // Xử lý đóng dropdown khi click bên ngoài
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
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

      // Đóng voucher dropdown khi click ra ngoài
      if (
        isVoucherOpen &&
        voucherRef.current &&
        !voucherRef.current.contains(event.target as Node)
      ) {
        setIsVoucherOpen(false);
      }
    },
    [isProfileOpen, isNotificationOpen, isVoucherOpen],
  );

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
        if (isVoucherOpen) setIsVoucherOpen(false);
        if (isOpen) setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isProfileOpen, isNotificationOpen, isVoucherOpen, isOpen]);

  const isActive = (path: string) => {
    return pathname === path
      ? 'text-primary-600 font-medium'
      : 'text-gray-700 hover:text-primary-600';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationOpen) setIsNotificationOpen(false);
    if (isVoucherOpen) setIsVoucherOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isOpen) setIsOpen(false);
    if (isNotificationOpen) setIsNotificationOpen(false);
    if (isVoucherOpen) setIsVoucherOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isOpen) setIsOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isVoucherOpen) setIsVoucherOpen(false);
  };

  const toggleVoucher = () => {
    setIsVoucherOpen(!isVoucherOpen);
    if (isOpen) setIsOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const formatCurrency = (amount: number) => {
    if (language === 'eng') {
      // For English, convert VND to USD (rough approximation)
      const usdAmount = amount / 24000; // Approximate conversion rate
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(usdAmount);
    } else {
      // For Vietnamese, use VND
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(amount).replace('₫', t('deposit.currencySymbol'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ).toLocaleDateString('vi-VN');
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        // Use a more elegant notification method instead of alert
        setShowNotification(true);
        setNotificationMessage(`Đã sao chép mã: ${code}`);

        // Hide notification after 2 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        setShowNotification(true);
        setNotificationMessage('Không thể sao chép mã. Vui lòng thử lại.');

        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      });
  };

  // Sắp xếp và lọc các vouchers để hiển thị
  const getDisplayVouchers = () => {
    if (!session?.user) {
      // Nếu không đăng nhập, chỉ hiển thị vouchers công khai
      return publicCoupons;
    }

    // Nếu đã đăng nhập, hiển thị cả vouchers công khai và voucher riêng
    // Loại bỏ trùng lặp giữa vouchers công khai và vouchers của người dùng
    const userVoucherIds = new Set(userCoupons.filter((v) => !v.isPublic).map((v) => v.id));
    const uniquePublicCoupons = publicCoupons.filter((v) => !userVoucherIds.has(v.id));

    // Lọc các voucher đã hết hạn và hết lượt
    const isExpired = (coupon: PublicCoupon): boolean => {
      try {
        const now = new Date();
        const expireDate = new Date(coupon.endDate);
        return expireDate < now;
      } catch (_error) {
        return false;
      }
    };

    const isOutOfUses = (coupon: PublicCoupon): boolean => {
      return coupon.userUsage !== undefined && coupon.userUsage.current >= coupon.userUsage.limit;
    };

    // Lọc ra các voucher còn hiệu lực và còn lượt sử dụng
    const filteredUserCoupons = userCoupons
      .filter((v) => !v.isPublic)
      .filter((v) => !isExpired(v) && !isOutOfUses(v));

    const filteredPublicCoupons = uniquePublicCoupons.filter((v) => !isExpired(v));

    // Sắp xếp: vouchers cá nhân trước, sau đó là vouchers công khai
    return [
      ...filteredUserCoupons, // Voucher riêng của người dùng
      ...filteredPublicCoupons, // Voucher công khai
    ];
  };

  // Các link chính của navigation
  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
    { href: '/bao-hanh', label: t('nav.warranty') },
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-full sm:container mx-auto max-w-full md:max-w-[98%] xl:max-w-[1280px] 2xl:max-w-[1400px] py-2 sm:py-3 md:py-2">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="XLab Logo"
                  width={100}
                  height={60}
                  unoptimized
                  className="w-auto h-8 sm:h-9 md:h-10 lg:h-11"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-wrap gap-x-4 gap-y-1 lg:gap-x-6 xl:gap-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${isActive(link.href)} transition-colors text-base lg:text-lg tracking-wide font-medium px-2 py-1 rounded-md hover:bg-gray-50 whitespace-nowrap`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side - Balance + Auth + Cart */}
            <div className="flex items-center gap-x-1 sm:gap-x-2 md:gap-x-3">
              {/* Balance Display */}
              {session && (
                <div className="hidden sm:block">
                  <BalanceDisplay />
                </div>
              )}

              {/* Language Switcher */}
              <LanguageSwitcher className="mr-2 hidden md:inline-flex" />

              {/* Voucher Icon */}
              <div className="relative" ref={voucherRef}>
                <button
                  onClick={toggleVoucher}
                  className="text-gray-700 hover:text-primary-600 focus:outline-none relative"
                  aria-label="Voucher"
                  aria-expanded={isVoucherOpen}
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
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  {session && userCoupons.filter((v) => !v.isPublic).length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {userCoupons.filter((v) => !v.isPublic).length}
                    </span>
                  )}
                </button>

                {/* Voucher Dropdown */}
                {isVoucherOpen && (
                  <div
                    className="absolute right-0 mt-2 w-[min(92vw,24rem)] sm:w-[min(92vw,26rem)] md:w-[min(92vw,28rem)] bg-white rounded-lg shadow-xl py-2 z-30"
                    tabIndex={0}
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-base font-semibold text-gray-900">{t('voucher.title')}</h3>
                      <Link
                        href="/vouchers/public"
                        className="text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                      >
                        {t('voucher.viewAll')}
                      </Link>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {loadingCoupons ? (
                        <div className="py-6 text-center">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-600"></div>
                          <p className="text-xs sm:text-sm text-gray-500 mt-2">{t('voucher.loading')}</p>
                        </div>
                      ) : getDisplayVouchers().length > 0 ? (
                        <>
                          {session && userCoupons.filter((v) => !v.isPublic).length > 0 && (
                            <div className="px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
                              <h4 className="text-xs font-medium text-teal-700">{t('voucher.yourVouchers')}</h4>
                            </div>
                          )}

                          {getDisplayVouchers().map((coupon, index) => (
                            <div key={coupon.id}>
                              <div
                                className={`p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${!coupon.isPublic ? 'bg-teal-50' : ''}`}
                                role="menuitem"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex items-center">
                                      <span
                                        onClick={() => handleCopyVoucher(coupon.code)}
                                        className={`${!coupon.isPublic ? 'bg-teal-600' : 'bg-emerald-600'} text-white font-mono text-xs font-bold px-2 py-1 rounded-md shadow-sm select-all cursor-pointer hover:opacity-90 transition-all flex items-center`}
                                        title={t('voucher.copyTooltip')}
                                      >
                                        {coupon.code}
                                      </span>
                                    </div>
                                    <span
                                      className={`text-xs font-medium ${coupon.type === 'percentage' ? 'text-teal-700 bg-teal-50 border border-teal-200' : 'text-emerald-700 bg-emerald-50 border border-emerald-200'} rounded-full px-2 py-0.5`}
                                    >
                                      {coupon.type === 'percentage'
                                        ? `${coupon.value}%`
                                        : formatCurrency(coupon.value)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                    {t('voucher.expiryDate')} {formatDate(coupon.endDate)}
                                  </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                                  {coupon.name}
                                </h4>
                                {coupon.description && (
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {coupon.description}
                                    </p>
                                    {coupon.userUsage && coupon.userUsage.limit > 0 && (
                                      <span className="text-xs font-medium text-teal-600">
                                        {t('voucher.usesLeft', { 
                                          count: coupon.userUsage && 
                                                 typeof coupon.userUsage.limit === 'number' && 
                                                 typeof coupon.userUsage.current === 'number' 
                                                 ? coupon.userUsage.limit - coupon.userUsage.current 
                                                 : 0
                                        })}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className="mt-2 flex justify-between items-center text-xs mb-1">
                                  <span className="text-xs font-medium px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                                    {coupon.minOrder
                                      ? `${t('voucher.minOrder')} ${formatCurrency(coupon.minOrder)}`
                                      : t('voucher.noLimit')}
                                  </span>
                                  {coupon.userUsage && coupon.userUsage.limit > 0 && (
                                    <span className="text-gray-500">
                                      {Math.min(
                                        100,
                                        Math.round(
                                          (coupon.userUsage.current / coupon.userUsage.limit) * 100,
                                        ),
                                      )}
                                      %
                                    </span>
                                  )}
                                </div>
                                {coupon.userUsage && coupon.userUsage.limit > 0 && (
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                    <div
                                      className={`h-full rounded-full ${
                                        coupon.userUsage.current >= coupon.userUsage.limit
                                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                                          : 'bg-gradient-to-r from-teal-500 to-emerald-600'
                                      }`}
                                      style={{
                                        width: `${Math.min(100, (coupon.userUsage.current / coupon.userUsage.limit) * 100)}%`,
                                      }}
                                    ></div>
                                  </div>
                                )}

                                {/* Note section removed */}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {t('voucher.noVouchers')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                      className="absolute right-0 mt-2 w-[min(92vw,24rem)] sm:w-[min(92vw,26rem)] md:w-[min(92vw,28rem)] bg-white rounded-lg shadow-xl py-2 z-30"
                      tabIndex={0}
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-base font-semibold text-gray-900">{t('notifications.title')}</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllAsRead();
                            }}
                            className="text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                          >
                            {t('notifications.markAllRead')}
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
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.content}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="text-xs sm:text-sm text-gray-500">
                              {t('notifications.none')}
                            </p>
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
                          {t('notifications.viewAll')}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="hidden md:inline-flex relative p-1.5 rounded-full text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">View cart</span>
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                    {itemCount}
                  </span>
                )}
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
                      alt={session.user?.name || 'User'}
                      size="md"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 ml-1 transform ${
                        isProfileOpen ? 'rotate-180' : ''
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
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-1 px-2 sm:py-1.5 sm:px-3 rounded-md text-sm md:text-base transition-colors"
                  >
                    {t('auth.signIn')}
                  </button>
                )}

                {/* Profile Dropdown */}
                {isProfileOpen && session && (
                  <div
                    className="absolute right-0 mt-2 w-[min(92vw,12rem)] md:w-[min(92vw,13rem)] bg-white rounded-lg shadow-xl py-2 z-30"
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
                      {t('nav.account')}
                    </Link>
                    <Link
                      href="/orders/history"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                      role="menuitem"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t('orders.myOrders')}
                    </Link>
                    {/* Admin link if user has admin role */}
                    {session.user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t('nav.admin')}
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
                      {t('auth.signOut')}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center space-x-3">
                {/* Language Switcher for Mobile */}
                <LanguageSwitcher className="mr-0.5" />

                <Link
                  href="/cart"
                  className="relative p-1.5 rounded-full text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  <span className="sr-only">View cart</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-primary-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={toggleMenu}
                  className="p-1.5 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span className="sr-only">Open menu</span>
                  {isOpen ? (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:hidden fixed top-[var(--header-height,56px)] left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-2 z-40`}
        >
          <nav className="container mx-auto px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${isActive(link.href)} block px-4 py-2 text-base font-medium rounded-md hover:bg-gray-50`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Notification toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-teal-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <span>{notificationMessage}</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-3 text-white hover:text-teal-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
