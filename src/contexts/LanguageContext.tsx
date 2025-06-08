'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionary for translations
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.about': 'Giới thiệu',
    'nav.contact': 'Liên hệ',
    'nav.warranty': 'Bảo hành',
    'user.login': 'Đăng nhập',
    'user.logout': 'Đăng xuất',
    'user.myAccount': 'Tài khoản của tôi',
    'user.myOrders': 'Đơn hàng của tôi',
    'user.admin': 'Quản trị viên',
    'voucher.title': 'Mã giảm giá',
    'voucher.viewAll': 'Xem tất cả',
    'voucher.loading': 'Đang tải...',
    'voucher.none': 'Không có mã giảm giá nào',
    'voucher.yourVouchers': 'Voucher của bạn',
    'voucher.validity': 'HSD',
    'voucher.minOrder': 'Đơn tối thiểu',
    'voucher.noLimit': 'Không giới hạn đơn',
    'voucher.usesLeft': 'Còn %d lượt',
    'notification.title': 'Thông báo',
    'notification.markAllRead': 'Đánh dấu tất cả đã đọc',
    'notification.none': 'Không có thông báo nào',
    'notification.viewAll': 'Xem tất cả thông báo',
    
    // Language switch
    'language.switch': 'English',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.warranty': 'Warranty',
    'user.login': 'Login',
    'user.logout': 'Logout',
    'user.myAccount': 'My Account',
    'user.myOrders': 'My Orders',
    'user.admin': 'Admin',
    'voucher.title': 'Vouchers',
    'voucher.viewAll': 'View all',
    'voucher.loading': 'Loading...',
    'voucher.none': 'No vouchers available',
    'voucher.yourVouchers': 'Your Vouchers',
    'voucher.validity': 'Valid until',
    'voucher.minOrder': 'Min order',
    'voucher.noLimit': 'No minimum order',
    'voucher.usesLeft': '%d uses left',
    'notification.title': 'Notifications',
    'notification.markAllRead': 'Mark all as read',
    'notification.none': 'No notifications',
    'notification.viewAll': 'View all notifications',
    
    // Language switch
    'language.switch': 'Tiếng Việt',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    // Load language from localStorage on client side
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 