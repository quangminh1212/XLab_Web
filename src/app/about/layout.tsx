'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Actualizar el título y la meta descripción cuando se monta el componente o cambia el idioma
  useEffect(() => {
    // Dùng template string để tạo chuỗi duy nhất
    document.title = `${t('about.title')} | XLab`;
    
    // Actualizar meta descripción
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('about.subtitle'));
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('about.subtitle');
      document.head.appendChild(meta);
    }

    // Ghi log để gỡ lỗi
    console.log("Thiết kế About được cập nhật với ngôn ngữ:", language);
    console.log("Tiêu đề hiện tại:", document.title);
    console.log("Mô tả meta:", t('about.subtitle'));
  }, [t, language]);

  return (
    <div className="about-layout" key={`about-layout-${language}-${forceUpdate}`}>
      {children}
    </div>
  );
};

export default AboutLayout;
