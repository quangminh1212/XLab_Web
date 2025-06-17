'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ServicesLayoutClient({ children }: { children: ReactNode }) {
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