'use client';

import { I18nextProvider } from 'react-i18next';
import initTranslations from '@/lib/i18n';
import { i18n } from 'i18next';
import { useEffect, useState } from 'react';

export default function I18nProvider({
  children,
  locale,
  namespaces,
}: {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
}) {
  const [i18nInstance, setI18nInstance] = useState<i18n | null>(null);

  useEffect(() => {
    const init = async () => {
      const instance = await initTranslations(locale, namespaces);
      setI18nInstance(instance);
    };
    if (!i18nInstance || i18nInstance.language !== locale) {
      init();
    }
  }, [locale, namespaces, i18nInstance]);
  
  if (!i18nInstance) {
    // You can return a loading component here
    return null;
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
} 