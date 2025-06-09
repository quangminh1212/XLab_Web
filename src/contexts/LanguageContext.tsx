'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Tạo một context mới
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.about': 'Giới thiệu',
    'nav.contact': 'Liên hệ',
    'nav.warranty': 'Bảo hành',
    'nav.login': 'Đăng nhập',
    'nav.logout': 'Đăng xuất',
    'nav.language': 'English',
    
    // Login page
    'login.welcome': 'Chào mừng trở lại!',
    'login.continue': 'Để tiếp tục sử dụng các dịch vụ của XLab',
    'login.connect': 'Kết nối an toàn với tài khoản Google của bạn',
    'login.google': 'Tiếp tục với Google',
    'login.secure': 'Bảo mật 100%',
    'login.terms': 'Bằng cách tiếp tục, bạn đồng ý với',
    'login.termsLink': 'Điều khoản dịch vụ',
    'login.and': 'và',
    'login.privacyLink': 'Chính sách bảo mật',
    'login.ourCompany': 'của chúng tôi.',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.warranty': 'Warranty',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.language': 'Tiếng Việt',
    
    // Login page
    'login.welcome': 'Welcome back!',
    'login.continue': 'To continue using XLab services',
    'login.connect': 'Connect securely with your Google account',
    'login.google': 'Continue with Google',
    'login.secure': '100% Secure',
    'login.terms': 'By continuing, you agree to our',
    'login.termsLink': 'Terms of Service',
    'login.and': 'and',
    'login.privacyLink': 'Privacy Policy',
    'login.ourCompany': '.',
  },
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>('vi');

  // Khởi tạo ngôn ngữ từ localStorage khi component được mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Hàm dịch văn bản
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook để sử dụng context này
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 