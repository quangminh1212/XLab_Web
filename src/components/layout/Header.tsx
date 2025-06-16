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
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Logo, 
  MobileNav, 
  DesktopNav,
  ProfileDropdown, 
  CartIcon 
} from '@/components/common';

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
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = React.useState(false);
  const [publicCoupons, setPublicCoupons] = React.useState<PublicCoupon[]>([]);
  const [userCoupons, setUserCoupons] = React.useState<PublicCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = React.useState(false);
  const [lastCouponFetch, setLastCouponFetch] = React.useState<number>(0);
  const [showNotification, setShowNotification] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState('');
  const [isScrolled, setIsScrolled] = useState(false);

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
  const fetchCoupons = async () => {
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
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    // Chỉ fetch khi voucher dropdown được mở hoặc đã quá 5 phút kể từ lần fetch cuối
    if (isVoucherOpen && (Date.now() - lastCouponFetch > 5 * 60 * 1000 || lastCouponFetch === 0)) {
      fetchCoupons();
    }
  }, [isVoucherOpen, session, lastCouponFetch]);

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
  }, [isVoucherOpen]);

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
  }, [isVoucherOpen]);

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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Header classes based on scroll state
  const headerClasses = `
    sticky top-0 z-30 w-full
    ${isScrolled 
      ? 'bg-white shadow-md' 
      : 'bg-white bg-opacity-90 backdrop-blur-sm'
    }
    transition-all duration-300
  `;

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
    return new Intl.NumberFormat(t('format.currency'), {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ).toLocaleDateString(t('format.date'));
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        // Use a more elegant notification method instead of alert
        setShowNotification(true);
        setNotificationMessage(t('notification.copied', {code: code}));

        // Hide notification after 2 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        setShowNotification(true);
        setNotificationMessage(t('notification.copyFailed'));

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
      } catch (error) {
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
      <header className={headerClasses}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <DesktopNav />
            </div>

            {/* Right Side Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Cart Icon */}
              <CartIcon />
              
              {/* Profile or Login Link */}
              {session ? (
                <ProfileDropdown user={session.user} />
              ) : (
                <Link 
                  href="/login"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent 
                    text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700
                    transition-colors duration-150"
                >
                  Đăng nhập
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <MobileNav />
            </div>
          </div>
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
