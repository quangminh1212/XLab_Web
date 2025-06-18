'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TitleUpdater(): React.ReactNode {
  const pathname = usePathname();
  const { t, language } = useLanguage();

  useEffect(() => {
    let pageTitle = '';

    // Xác định tiêu đề dựa trên đường dẫn
    if (pathname === '/') {
      pageTitle = `${t('nav.home')} | XLab`;
    } else if (pathname.startsWith('/admin')) {
      pageTitle = `${t('admin.title')} | XLab`;
    } else if (pathname === '/vouchers/public') {
      pageTitle = `${t('voucher.title')} | XLab`;
    } else if (pathname === '/products') {
      pageTitle = `${t('nav.products')} | XLab`;
    } else if (pathname === '/about') {
      pageTitle = `${t('nav.about')} | XLab`;
    } else if (pathname === '/contact') {
      pageTitle = `${t('nav.contact')} | XLab`;
    } else if (pathname === '/bao-hanh') {
      pageTitle = `${t('nav.warranty')} | XLab`;
    } else {
      // Tiêu đề mặc định
      pageTitle = `${t('common.softwareAndServices')} | XLab`;
    }

    // Áp dụng tiêu đề
    document.title = pageTitle;

    if (process.env.NODE_ENV === 'development') {
      console.log('TitleUpdater: Setting title to', pageTitle);
      console.log('TitleUpdater: Current language', language);
      console.log('TitleUpdater: Current pathname', pathname);
    }

    // Tạo thẻ title mới nếu cần
    let titleElement = document.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
    }
    titleElement.textContent = pageTitle;

  }, [pathname, t, language]);

  return null;
} 