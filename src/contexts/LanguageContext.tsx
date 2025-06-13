'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en' | 'es';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Tạo một context mới
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Bộ dịch tiếng Việt
const viTranslations: Record<string, string> = {
  // Admin Notifications
  'admin.notifications.title': 'Quản lý thông báo',
  // ... các key tiếng Việt khác ...
  
  // Footer
  'footer.aboutLink': 'Giới thiệu',
  'footer.productsAndServices': 'Sản phẩm & Dịch vụ',
  'footer.products': 'Sản phẩm',
  'footer.services': 'Dịch vụ',
  'footer.testimonials': 'Đánh giá',
  'footer.navigationLinks': 'Liên kết điều hướng',
  'footer.pricing': 'Bảng giá',
  'footer.contactLink': 'Liên hệ',
  'footer.copyright': 'Bản quyền thuộc về công ty',
  'footer.acceptedPayments': 'Thanh toán được chấp nhận',
  'footer.companyDescription1': 'XLab là doanh nghiệp hàng đầu trong lĩnh vực giải pháp công nghệ và phát triển phần mềm chuyên nghiệp cho doanh nghiệp.',
  'footer.companyDescription2': 'Với đội ngũ chuyên gia giàu kinh nghiệm, XLab tự hào là đối tác tin cậy của hơn 500+ doanh nghiệp.',
  'footer.customers': '500+ Khách hàng', 
  'footer.years': '5+ Năm',
  'footer.support': 'Hỗ trợ 24/7'
};

// Bộ dịch tiếng Anh
const enTranslations: Record<string, string> = {
  // Admin Notifications  
  'admin.notifications.title': 'Notification Management',
  // ... các key tiếng Anh khác ...
  
  // Footer
  'footer.aboutLink': 'About',
  'footer.productsAndServices': 'Products & Services',
  'footer.products': 'Products',
  'footer.services': 'Services',
  'footer.testimonials': 'Testimonials',
  'footer.navigationLinks': 'Navigation Links',
  'footer.pricing': 'Pricing',
  'footer.contactLink': 'Contact',
  'footer.copyright': 'Company copyright',
  'footer.acceptedPayments': 'Accepted Payments',
  'footer.companyDescription1': 'XLab is a leading company in the field of technological solutions and professional software development for businesses.',
  'footer.companyDescription2': 'With a team of experienced experts, XLab is proud to be a trusted partner of over 500+ companies.',
  'footer.customers': '500+ Customers',
  'footer.years': '5+ Years',
  'footer.support': '24/7 Support'
};

// Bộ dịch tiếng Tây Ban Nha
const esTranslations: Record<string, string> = {
  // Admin Notifications
  'admin.notifications.title': 'Gestión de notificaciones',
  // ... các key tiếng Tây Ban Nha khác ...
  
  // Footer
  'footer.aboutLink': 'Acerca de',
  'footer.productsAndServices': 'Productos y Servicios',
  'footer.products': 'Productos',
  'footer.services': 'Servicios',
  'footer.testimonials': 'Testimonios',
  'footer.navigationLinks': 'Enlaces de navegación',
  'footer.pricing': 'Precios',
  'footer.contactLink': 'Contacto',
  'footer.copyright': 'Derechos de autor de la compañía',
  'footer.acceptedPayments': 'Pagos aceptados',
  'footer.companyDescription1': 'XLab es una empresa líder en el campo de soluciones tecnológicas y desarrollo de software profesional para empresas.',
  'footer.companyDescription2': 'Con un equipo de expertos experimentados, XLab se enorgullece de ser un socio de confianza para más de 500+ empresas.',
  'footer.customers': '500+ Clientes',
  'footer.years': '5+ Años',
  'footer.support': 'Soporte 24/7'
};

// Tất cả các bản dịch
const translations: Record<Language, Record<string, string>> = {
  vi: viTranslations,
  en: enTranslations,
  es: esTranslations
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Khởi tạo ngôn ngữ từ localStorage nếu có, nếu không mặc định là tiếng Việt
  const [language, setLanguageState] = useState<Language>(() => {
    // Kiểm tra nếu đang chạy trên client
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en' || savedLanguage === 'es')) {
        return savedLanguage as Language;
      }
    }
    return 'vi';
  });

  // Thêm effect để cài đặt thuộc tính lang cho document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
    }
  };

  // Hàm dịch văn bản
  const t = (key: string, params?: Record<string, any>): string => {
    try {
      // Kiểm tra key hợp lệ
      if (typeof key !== 'string' || !key) {
        console.warn('Invalid translation key:', key);
        return '';
      }
      
      // Lấy đúng đối tượng dịch
      let text = '';
      if (language === 'vi' && translations.vi[key]) {
        text = translations.vi[key];
      } else if (language === 'en' && translations.en[key]) {
        text = translations.en[key];
      } else if (language === 'es' && translations.es[key]) {
        text = translations.es[key];
      } else {
        // Fallback nếu không tìm thấy key trong ngôn ngữ hiện tại
        text = translations.vi[key] || key;
      }
      
      // Thay thế tham số nếu có
      if (params && typeof params === 'object' && Object.keys(params).length > 0) {
        Object.entries(params).forEach(([param, value]) => {
          const regex = new RegExp(`\\{${param}\\}`, 'g');
          const strValue = convertValueToString(value, param);
          text = text.replace(regex, strValue);
        });
      }
      
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return typeof key === 'string' ? key : '';
    }
  };
  
  // Hàm hỗ trợ chuyển đổi giá trị thành chuỗi an toàn
  function convertValueToString(value: any, paramName: string): string {
    if (value === undefined || value === null) {
      return '';
    }
    
    if (typeof value === 'object') {
      try {
        return String(value);
      } catch (err) {
        console.warn(`Error converting object param ${paramName}:`, err);
        return '';
      }
    }
    
    try {
      return String(value);
    } catch (err) {
      console.warn(`Error converting param ${paramName}:`, err);
      return '';
    }
  }

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