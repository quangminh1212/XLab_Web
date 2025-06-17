import { eng } from './eng';
import { vie } from './vie';

export const translations = {
  eng,
  vie
};

export type LanguageKeys = keyof typeof translations;
export const defaultLanguage: LanguageKeys = 'vie';

export function getTranslation(key: string, language: LanguageKeys = defaultLanguage): string {
  // @ts-ignore: The translations object might not have all the keys
  const translation = translations[language][key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key} in ${language}`);
    // Try to fall back to English if Vietnamese translation is missing
    if (language !== 'eng') {
      // @ts-ignore: The translations object might not have all the keys
      const fallbackTranslation = translations.eng[key];
      if (fallbackTranslation) {
        return fallbackTranslation;
      }
    }
    // If all else fails, just return the key
    return key;
  }
  return translation;
}

export { eng, vie }; 