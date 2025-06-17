'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VoucherPublicLayout({ children }: { children: ReactNode }) {
  const { t, language, setLanguage } = useLanguage();
  
  // Force Vietnamese language on first load
  useEffect(() => {
    if (language !== 'vie') {
      console.log('Forcing Vietnamese language');
      setLanguage('vie');
    }
  }, []);
  
  useEffect(() => {
    // Cập nhật tiêu đề trang khi ngôn ngữ thay đổi
    console.log('Current language in voucher layout:', language);
    console.log('voucher.title value:', t('voucher.title'));
    console.log('common.softwareAndServices value:', t('common.softwareAndServices'));
    
    const titleValue = `${t('voucher.title')} | XLab - ${t('common.softwareAndServices')}`;
    console.log('Final title value:', titleValue);
    
    // Cập nhật title bằng nhiều cách
    document.title = titleValue;
    
    // Thử cách thêm mới: Tạo thẻ tiêu đề mới nếu cần
    const existingTitle = document.querySelector('title');
    if (existingTitle) {
      existingTitle.textContent = titleValue;
    } else {
      const newTitle = document.createElement('title');
      newTitle.textContent = titleValue;
      document.head.appendChild(newTitle);
    }
    
    // Cập nhật meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('voucher.public.description'));
    }
    
    // Force reflow
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
    
  }, [t, language]);
  
  return <>{children}</>;
} 