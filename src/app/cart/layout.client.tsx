'use client';

import { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function CartLayoutClient({ children }: { children: ReactNode }) {
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

// Add a default export
export default CartLayoutClient; 