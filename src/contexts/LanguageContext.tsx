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
    
    // Homepage
    'home.tagline': 'Tối ưu hiệu quả, tối thiểu chi phí!',
    'home.search.placeholder': 'Tìm kiếm phần mềm, ứng dụng...',
    'home.about.title': 'Về XLab',
    'home.about.desc1': 'XLab là nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến giúp người dùng nâng cao hiệu suất công việc và cuộc sống hàng ngày.',
    'home.about.desc2': 'Sứ mệnh của chúng tôi là đem đến cho người Việt cơ hội tiếp cận với các công cụ phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.',
    'home.about.learnMore': 'Tìm hiểu thêm',
    'home.feature.domesticProduct': 'Sản phẩm trong nước',
    'home.feature.domesticDesc': 'Phát triển bởi đội ngũ kỹ sư Việt Nam',
    'home.feature.support': 'Hỗ trợ 24/7',
    'home.feature.supportDesc': 'Đội ngũ hỗ trợ tận tâm',
    'home.feature.security': 'Bảo mật cao',
    'home.feature.securityDesc': 'Dữ liệu được mã hóa an toàn',
    'home.feature.price': 'Giá cả hợp lý',
    'home.feature.priceDesc': 'Nhiều lựa chọn phù hợp mọi ngân sách',
    'home.feature.ai': 'Tích hợp AI',
    'home.feature.aiDesc': 'Công nghệ AI tiên tiến hỗ trợ bạn',
    'home.feature.updates': 'Cập nhật liên tục',
    'home.feature.updatesDesc': 'Luôn được cập nhật tính năng mới',
    'home.stats.title': 'Thành tựu của chúng tôi',
    'home.stats.customers': 'Khách hàng tin dùng',
    'home.stats.solutions': 'Giải pháp phần mềm',
    'home.stats.experience': 'Năm kinh nghiệm',
    'home.software.title': 'Phần mềm',
    'home.service.title': 'Dịch vụ',
    'home.viewAll': 'Xem tất cả',
    'home.loading': 'Đang tải...',
    'home.noSoftware.title': 'Chưa có phần mềm',
    'home.noSoftware.desc': 'Chúng tôi sẽ sớm cập nhật các phần mềm.',
    'home.noService.title': 'Chưa có dịch vụ',
    'home.noService.desc': 'Chúng tôi sẽ sớm cập nhật các dịch vụ.',
    'home.faq.title': 'Câu hỏi thường gặp',
    'home.faq.desc': 'Giải đáp những thắc mắc phổ biến của khách hàng về sản phẩm và dịch vụ của XLab',
    
    // Footer
    'footer.company': 'Công ty',
    'footer.about': 'Về chúng tôi',
    'footer.contact': 'Liên hệ',
    'footer.careers': 'Tuyển dụng',
    'footer.legal': 'Pháp lý',
    'footer.terms': 'Điều khoản',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.support': 'Hỗ trợ',
    'footer.help': 'Trung tâm trợ giúp',
    'footer.faq': 'Câu hỏi thường gặp',
    'footer.refund': 'Chính sách hoàn tiền',
    'footer.copyright': 'Bản quyền',
    'footer.rights': 'Mọi quyền được bảo lưu.',
    'footer.navigation': 'Điều hướng',
    'footer.services': 'Dịch vụ',
    'footer.testimonials': 'Đánh giá',
    'footer.pricing': 'Bảng giá',
    
    // Product card
    'product.originalPrice': 'Giá gốc:',
    'product.buyNow': 'Mua ngay',
    'product.addToCart': 'Thêm vào giỏ',
    'product.sold': 'Đã bán',
    'product.reviews': 'đánh giá',
    'product.thisWeek': 'tuần này',
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
    
    // Homepage
    'home.tagline': 'Optimize efficiency, minimize costs!',
    'home.search.placeholder': 'Search for software, applications...',
    'home.about.title': 'About XLab',
    'home.about.desc1': 'XLab is a platform providing advanced AI-integrated software solutions to help users improve work efficiency and daily life.',
    'home.about.desc2': 'Our mission is to provide Vietnamese people with access to work, study, and entertainment tools at affordable prices and international quality.',
    'home.about.learnMore': 'Learn more',
    'home.feature.domesticProduct': 'Domestic Products',
    'home.feature.domesticDesc': 'Developed by Vietnamese engineers',
    'home.feature.support': '24/7 Support',
    'home.feature.supportDesc': 'Dedicated support team',
    'home.feature.security': 'High Security',
    'home.feature.securityDesc': 'Data is securely encrypted',
    'home.feature.price': 'Reasonable Prices',
    'home.feature.priceDesc': 'Many options for all budgets',
    'home.feature.ai': 'AI Integration',
    'home.feature.aiDesc': 'Advanced AI technology to support you',
    'home.feature.updates': 'Continuous Updates',
    'home.feature.updatesDesc': 'Always updated with new features',
    'home.stats.title': 'Our Achievements',
    'home.stats.customers': 'Trusted customers',
    'home.stats.solutions': 'Software solutions',
    'home.stats.experience': 'Years of experience',
    'home.software.title': 'Software',
    'home.service.title': 'Services',
    'home.viewAll': 'View all',
    'home.loading': 'Loading...',
    'home.noSoftware.title': 'No software yet',
    'home.noSoftware.desc': 'We will update software soon.',
    'home.noService.title': 'No services yet',
    'home.noService.desc': 'We will update services soon.',
    'home.faq.title': 'Frequently Asked Questions',
    'home.faq.desc': 'Answering common customer questions about XLab products and services',
    
    // Footer
    'footer.company': 'Company',
    'footer.about': 'About us',
    'footer.contact': 'Contact',
    'footer.careers': 'Careers',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy Policy',
    'footer.support': 'Support',
    'footer.help': 'Help Center',
    'footer.faq': 'FAQ',
    'footer.refund': 'Refund Policy',
    'footer.copyright': 'Copyright',
    'footer.rights': 'All rights reserved.',
    'footer.navigation': 'Navigation',
    'footer.services': 'Services',
    'footer.testimonials': 'Testimonials',
    'footer.pricing': 'Pricing',
    
    // Product card
    'product.originalPrice': 'Original price:',
    'product.buyNow': 'Buy now',
    'product.addToCart': 'Add to cart',
    'product.sold': 'Sold',
    'product.reviews': 'reviews',
    'product.thisWeek': 'this week',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load language from localStorage on client side
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Only interact with localStorage on the client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
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