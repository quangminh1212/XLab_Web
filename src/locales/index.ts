import { eng } from './eng';
import { vie } from './vie';

export const translations = {
  eng,
  vie
};

export type LanguageKeys = keyof typeof translations;
export const defaultLanguage: LanguageKeys = 'vie';

export function getTranslation(key: string, language: LanguageKeys = defaultLanguage): string {
  try {
    // Special case for nav.home in footer context - this is a common issue
    if (key === 'nav.home') {
      // @ts-ignore: The translations object might have nested structure
      return translations[language]['nav.home'] || translations.eng['nav.home'] || 'Home';
    }

    // Handle nested keys (e.g., 'nav.home')
    const keys = key.split('.');
    let translation = translations[language];
    
    // Navigate through nested objects
    for (const k of keys) {
      // @ts-ignore: The translations object might have nested structure
      translation = translation[k];
      
      // If we hit undefined at any level, break early
      if (translation === undefined) break;
    }
    
    if (translation === undefined) {
      // Try direct access with the full key
      // @ts-ignore: The translations object might not have all the keys
      const directTranslation = translations[language][key];
      if (directTranslation !== undefined) {
        return directTranslation;
      }
      
      console.warn(`Translation missing for key: ${key} in ${language}`);
      
      // Try to fall back to English if Vietnamese translation is missing
      if (language !== 'eng') {
        // Try direct access with the full key in English
        // @ts-ignore: The translations object might not have all the keys
        const directEnglishTranslation = translations.eng[key];
        if (directEnglishTranslation !== undefined) {
          return directEnglishTranslation;
        }
        
        let fallbackTranslation = translations.eng;
        let fallbackFound = true;
        
        // Navigate through nested objects for fallback
        for (const k of keys) {
          // @ts-ignore: The translations object might have nested structure
          fallbackTranslation = fallbackTranslation[k];
          
          // If we hit undefined at any level, break early
          if (fallbackTranslation === undefined) {
            fallbackFound = false;
            break;
          }
        }
        
        if (fallbackFound) {
          return fallbackTranslation;
        }
      }
      
      // If all else fails, just return the key
      return key;
    }
    
    return translation;
  } catch (error) {
    console.error(`Error getting translation for key: ${key}`, error);
    return key;
  }
}

export { eng, vie }; 