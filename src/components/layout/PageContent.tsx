'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { TranslateWrapper } from '@/hooks/useAutoTranslate';
import { useTranslation } from '@/contexts/TranslationContext';

interface PageContentProps {
  children: ReactNode;
}

/**
 * Component bọc nội dung trang và áp dụng dịch tự động
 */
const PageContent: React.FC<PageContentProps> = ({ children }) => {
  const { language } = useTranslation();
  
  // Thêm class vào body để xác định ngôn ngữ hiện tại
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Xóa tất cả các class ngôn ngữ
      document.body.classList.remove('lang-vi', 'lang-en');
      // Thêm class ngôn ngữ hiện tại
      document.body.classList.add(`lang-${language}`);
    }
  }, [language]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Thêm hiệu ứng tải trang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Thêm class initial-loading
      document.body.classList.add('initial-loading');
      
      // Thiết lập timeout để đánh dấu đã tải xong
      const timer = setTimeout(() => {
        document.body.classList.remove('initial-loading');
        document.body.classList.add('loaded');
        setIsLoading(false);
      }, 300); // Thời gian đủ ngắn để không gây khó chịu
      
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('initial-loading', 'loaded');
      };
    }
  }, []);
  
  return (
    <div className={`page-content transition-lang ${isLoading ? 'loading' : ''}`}>
      <TranslateWrapper>
        {children}
      </TranslateWrapper>
    </div>
  );
};

export default PageContent; 