'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Component tự động chuyển đổi ngôn ngữ dựa trên Accept-Language header
 * của trình duyệt hoặc từ cài đặt ngôn ngữ được lưu.
 */
const LanguageAutoSwitcher = (): JSX.Element | null => {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // Chỉ thực hiện một lần khi component mount
    const detectLanguage = () => {
      // Ưu tiên ngôn ngữ đã lưu trong localStorage
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && ['vi', 'en', 'es'].includes(savedLanguage)) {
        setLanguage(savedLanguage as 'vi' | 'en' | 'es');
        return;
      }

      // Nếu không có ngôn ngữ đã lưu, kiểm tra từ navigator.language 
      // hoặc header Accept-Language của trình duyệt
      const browserLang = navigator.language || 
        (navigator as any).userLanguage || 
        (navigator as any).browserLanguage || 
        'vi';

      // Lấy phần đầu của chuỗi ngôn ngữ (ví dụ: 'es-ES' -> 'es')
      const primaryLang = browserLang.split('-')[0].toLowerCase();

      // Chuyển đổi ngôn ngữ nếu được hỗ trợ
      if (primaryLang === 'es') {
        setLanguage('es');
      } else if (primaryLang === 'en') {
        setLanguage('en');
      } else {
        // Mặc định là tiếng Việt nếu không phát hiện được hoặc không hỗ trợ
        setLanguage('vi');
      }
    };

    detectLanguage();
  }, [setLanguage]);

  // Component này không render gì cả
  return null;
};

export default LanguageAutoSwitcher; 