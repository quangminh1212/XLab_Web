import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import i18nConfig from '../../next-i18next.config.js';

export default async function initTranslations(locale: string, namespaces: string[] = ['common']) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)))
    .init({
      lng: locale,
      fallbackLng: i18nConfig.i18n.defaultLocale,
      supportedLngs: i18nConfig.i18n.locales,
      defaultNS: namespaces[0],
      fallbackNS: namespaces[0],
      ns: namespaces,
      preload: typeof window === 'undefined' ? i18nConfig.i18n.locales : [],
    });
  return i18nInstance;
} 