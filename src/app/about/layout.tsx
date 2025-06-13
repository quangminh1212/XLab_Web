'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Cập nhật title và meta description khi component mount hoặc ngôn ngữ thay đổi
  useEffect(() => {
    // Force re-render khi ngôn ngữ thay đổi
    setForceUpdate(prev => prev + 1);
    
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

    // Log để debug
    console.log("About layout updated with language:", language);
    console.log("Title now:", document.title);
    console.log("Meta description:", t('about.subtitle'));
  }, [t, language]);

  return (
    <div className="about-layout" key={`about-layout-${language}-${forceUpdate}`}>
      {children}
    </div>
  );
};

export default AboutLayout;
