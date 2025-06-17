'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Initial metadata for server-side rendering
export const metadata = {
  title: 'Dịch vụ | XLab - Phần mềm và Dịch vụ',
  description: 'Danh sách các dịch vụ cao cấp với giá tốt nhất thị trường',
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Update document title when language changes
    document.title = `${t('services.title')} | XLab - ${t('common.softwareAndServices')}`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('services.metaDescription'));
    }
  }, [t]);
  
  return <>{children}</>;
}
