'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VoucherPublicLayout({ children }: { children: ReactNode }) {
  const { t, language } = useLanguage();
  
  useEffect(() => {
    // Cập nhật tiêu đề trang khi ngôn ngữ thay đổi
    console.log('Current language in voucher layout:', language);
    
    const titleValue = `${t('voucher.title')} | XLab - ${t('common.softwareAndServices')}`;
    console.log('Final title value:', titleValue);
    
    // Cập nhật title
    document.title = titleValue;
    
    // Cập nhật meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('voucher.public.description'));
    }
  }, [t, language]);
  
  return <>{children}</>;
} 