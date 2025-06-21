import { eng } from './eng';
import { vie } from './vie';
import { spa } from './spa';
<<<<<<< HEAD
import { chi } from './chi';
=======
import * as localeDebug from '@/utils/localeDebug';
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470

export const translations = {
  eng,
  vie,
  spa,
  chi
};

export type LanguageKeys = keyof typeof translations;
export const defaultLanguage: LanguageKeys = 'vie';

// Re-export debug utility function for backward compatibility
export const debugMissingTranslations = localeDebug.generateMissingTranslationsReport;

export function getTranslation(key: string, language: LanguageKeys = defaultLanguage): string {
  try {
    // Force defaultLanguage if no language provided 
    if (!language) {
      language = defaultLanguage;
      console.warn('No language provided, using default:', defaultLanguage);
    }
    
    // Ensure language is valid
    const safeLanguage: LanguageKeys = translations[language] ? language : defaultLanguage;
    
    // Log missing translations using the debug utility
    const logMissingTranslation = (k: string, lang: LanguageKeys) => {
      if (process.env.NODE_ENV === 'development') {
        // Use our new debug utility instead
        localeDebug.logMissingTranslation(k, lang);
      }
    };
    
    // Direct access approach - most reliable
    if (key.includes('.')) {
      // For keys with dots, try direct access first
      // @ts-ignore: The translations object might not have all the keys
      const directResult = translations[safeLanguage][key];
      if (directResult !== undefined) {
        return directResult;
      }
      
      // If direct access fails and we're using Vietnamese or Spanish, try English as fallback
      if (safeLanguage === 'vie' || safeLanguage === 'spa' || safeLanguage === 'chi') {
        // @ts-ignore: The translations object might not have all the keys
        const engDirectResult = translations.eng[key];
        if (engDirectResult !== undefined) {
          logMissingTranslation(key, safeLanguage);
          return engDirectResult;
        }
      }
    }

    // Special cases for commonly used keys
    if (key === 'nav.home') return translations[safeLanguage]['nav.home'] || 'Home';
    if (key === 'auth.signIn') return translations[safeLanguage]['auth.signIn'] || 'Sign In';
    if (key === 'auth.signOut') return translations[safeLanguage]['auth.signOut'] || 'Sign Out';
    // @ts-ignore: May not exist in all translation files
    if (key === 'account.myOrders') return translations[safeLanguage]['account.myOrders'] || 'My Orders';

    // Handle nested keys approach (less reliable)
    const keys = key.split('.');
    let result = translations[safeLanguage];
    
    // Navigate through nested objects safely
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      // @ts-ignore: The translations object might have nested structure
      if (result && typeof result === 'object' && result[k] !== undefined) {
        // @ts-ignore: The translations object might have nested structure
        result = result[k];
      } else {
        // If we hit undefined at any level, try English fallback
        if (safeLanguage !== 'eng') {
          let engResult = translations.eng;
          let engFound = true;
          
          // Try to navigate the same path in English translations
          for (let j = 0; j <= i; j++) {
            const engKey = keys[j];
            // @ts-ignore: The translations object might have nested structure
            if (engResult && typeof engResult === 'object' && engResult[engKey] !== undefined) {
              // @ts-ignore: The translations object might have nested structure
              engResult = engResult[engKey];
            } else {
              engFound = false;
              break;
            }
          }
          
          if (engFound) {
            logMissingTranslation(key, safeLanguage);
            return String(engResult);
          }
        }
        
        logMissingTranslation(key, safeLanguage);
        return key; // Return the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  } catch (error) {
    console.error(`Error getting translation for key: ${key}`, error);
    return key;
  }
}

// Define global type for debug object
declare global {
  interface Window {
    __LANGUAGE_DEBUG?: {
      translations: typeof translations;
      defaultLanguage: LanguageKeys;
      getTranslation: typeof getTranslation;
      debugMissingTranslations: typeof debugMissingTranslations;
    };
  }
}

// For debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.__LANGUAGE_DEBUG = {
    translations,
    defaultLanguage,
    getTranslation,
    debugMissingTranslations
  };
}

export { eng, vie, spa, chi }; 