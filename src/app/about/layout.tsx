'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  const { t, language } = useLanguage();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Actualizar el título y la meta descripción cuando se monta el componente o cambia el idioma
  useEffect(() => {
    // Forzar re-renderizado cuando cambia el idioma
    setForceUpdate(prev => prev + 1);
    
    // Usar template string para crear una cadena única
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

    // Log para depuración
    console.log("Diseño About actualizado con idioma:", language);
    console.log("Título ahora:", document.title);
    console.log("Meta descripción:", t('about.subtitle'));
  }, [t, language]);

  return (
    <div className="about-layout" key={`about-layout-${language}-${forceUpdate}`}>
      {children}
    </div>
  );
};

export default AboutLayout;
