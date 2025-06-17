'use client';

import { Metadata } from 'next';
import { ReactNode, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// This metadata is only used for initial server-side rendering
export const metadata: Metadata = {
  title: 'Giỏ hàng | XLab - Phần mềm và Dịch vụ',
  description: 'Giỏ hàng của bạn tại XLab - Phần mềm và Dịch vụ',
};

export default function CartLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  
  useEffect(() => {
    // Update document title when language changes
    document.title = `${t('cart.title')} | XLab - ${t('common.softwareAndServices')}`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('cart.metaDescription'));
    }
  }, [t]);
  
  return <>{children}</>;
}
