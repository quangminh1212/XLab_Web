'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VoucherPublicLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Cập nhật tiêu đề trang khi ngôn ngữ thay đổi
    document.title = `${t('voucher.title')} | XLab - ${t('common.softwareAndServices')}`;
    
    // Cập nhật meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('voucher.public.description'));
    }
  }, [t]);
  
  return <>{children}</>;
} 