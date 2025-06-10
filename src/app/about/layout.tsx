'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  
  // Cập nhật title và meta description khi component mount hoặc ngôn ngữ thay đổi
  useEffect(() => {
    // Sử dụng template string để tạo ra một chuỗi duy nhất
    document.title = `${t('about.title')} | XLab`;
    
    // Cập nhật meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('about.subtitle'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('about.subtitle');
      document.head.appendChild(meta);
    }
  }, [t]);

  return (
    <div className="about-layout">
      {children}
    </div>
  );
};

export default AboutLayout;
