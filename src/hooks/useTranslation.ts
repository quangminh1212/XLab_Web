import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

type Translations = {
  [key: string]: any;
};

// Cache for loaded translation files
const translationCache: Record<string, Translations> = {};

export const useTranslation = (namespace: string = 'common') => {
  const router = useRouter();
  const locale = router.locale || router.defaultLocale || 'eng';
  const [translations, setTranslations] = useState<Translations>({});

  // Load the translation file
  useEffect(() => {
    const loadTranslations = async () => {
      const cacheKey = `${locale}:${namespace}`;
      
      // Check cache first
      if (translationCache[cacheKey]) {
        setTranslations(translationCache[cacheKey]);
        return;
      }

      try {
        // Load the translation file dynamically
        const translations = await import(`../../locales/${locale}/${namespace}.json`);
        translationCache[cacheKey] = translations;
        setTranslations(translations);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}/${namespace}:`, error);
        // Fallback to empty translations
        setTranslations({});
      }
    };

    loadTranslations();
  }, [locale, namespace]);

  // Translation function
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      // Split the key by dots to navigate through nested objects
      const keys = key.split('.');
      
      // Traverse the translation object
      let value: any = translations;
      for (const k of keys) {
        if (!value || !value[k]) {
          // Return the key if translation is not found
          return key;
        }
        value = value[k];
      }

      // If value is not a string, return the key
      if (typeof value !== 'string') {
        return key;
      }

      // Replace parameters in the translation
      if (params) {
        let translatedText: string = value;
        for (const [paramKey, paramValue] of Object.entries(params)) {
          translatedText = translatedText.replace(
            new RegExp(`{{${paramKey}}}`, 'g'), 
            String(paramValue)
          );
        }
        return translatedText;
      }

      return value;
    },
    [translations]
  );

  return { t, locale };
};

export default useTranslation; 