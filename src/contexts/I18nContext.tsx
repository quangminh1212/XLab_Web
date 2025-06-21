'use client';

import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';

type Translations = Record<string, any>;

type I18nContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
};

interface I18nProviderProps {
  children: ReactNode;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Cache for loaded translation files
const translationCache: Record<string, Record<string, Translations>> = {
  eng: {},
  vie: {}
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const router = useRouter();
  const [language, setLanguageState] = useState<string>('eng');
  const [translations, setTranslations] = useState<Record<string, Translations>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize language from router locale
  useEffect(() => {
    if (router && router.locale) {
      setLanguageState(router.locale);
    }
  }, [router]);

  // Load all translation files for current language
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);

      if (translationCache[language] && Object.keys(translationCache[language]).length > 0) {
        setTranslations(translationCache[language]);
        setIsLoading(false);
        return;
      }

      try {
        // Load common translations always
        const filesToLoad = ['common', 'home', 'products', 'auth', 'checkout', 'errors'];
        const loadedTranslations: Record<string, Translations> = {};

        await Promise.all(
          filesToLoad.map(async (file) => {
            try {
              // Fix path to locales folder - use relative to root, not triple parent directory
              const module = await import(`/locales/${language}/${file}.json`);
              loadedTranslations[file] = module;
            } catch (error) {
              console.error(`Failed to load ${file} translations for ${language}:`, error);
            }
          })
        );

        translationCache[language] = loadedTranslations;
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    if (router && router.locale !== lang) {
      router.push(router.pathname, router.asPath, { locale: lang });
    }
  }, [router]);

  const t = useCallback(
    (key: string, params?: Record<string, any>): string => {
      if (isLoading) return key;

      // Split the key into namespace and actual key
      const parts = key.includes(':') ? key.split(':') : ['common', key];
      const namespace = parts[0];
      const actualKey = parts[1];

      // Split the key by dots to navigate through nested objects
      const keys = actualKey.split('.');
      
      // Check if we have translations for this namespace
      const namespaceTranslations = translations[namespace];
      if (!namespaceTranslations) {
        return actualKey;
      }

      // Traverse the translation object
      let value: any = namespaceTranslations;
      for (const k of keys) {
        if (!value || !value[k]) {
          // Return the key if translation is not found
          return actualKey;
        }
        value = value[k];
      }

      // If value is not a string, return the key
      if (typeof value !== 'string') {
        return actualKey;
      }

      // Replace parameters in the translation
      if (params) {
        let result: string = value;
        for (const [paramKey, paramValue] of Object.entries(params)) {
          result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
        }
        return result;
      }

      return value;
    },
    [translations, isLoading]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export default useI18n; 