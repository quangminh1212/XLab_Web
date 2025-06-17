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
    // Ensure language is valid
    const safeLanguage: LanguageKeys = translations[language] ? language : 'eng';
    
    // Direct access approach - most reliable
    if (key.includes('.')) {
      // For keys with dots, try direct access first
      // @ts-ignore: The translations object might not have all the keys
      const directResult = translations[safeLanguage][key];
      if (directResult !== undefined) {
        return directResult;
      }
      
      // If direct access fails and we're using Vietnamese, try English
      if (safeLanguage === 'vie') {
        // @ts-ignore: The translations object might not have all the keys
        const engDirectResult = translations.eng[key];
        if (engDirectResult !== undefined) {
          return engDirectResult;
        }
      }
    }

    // Special cases for commonly used keys
    if (key === 'nav.home') return translations[safeLanguage]['nav.home'] || 'Home';
    if (key === 'auth.signIn') return translations[safeLanguage]['auth.signIn'] || 'Sign In';
    if (key === 'auth.signOut') return translations[safeLanguage]['auth.signOut'] || 'Sign Out';
    if (key === 'orders.myOrders') return translations[safeLanguage]['orders.myOrders'] || 'My Orders';

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
            return engResult;
          }
        }
        
        console.warn(`Translation missing for key: ${key} in ${safeLanguage}`);
        return key; // Return the key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  } catch (error) {
    console.error(`Error getting translation for key: ${key}`, error);
    return key;
  }
}

export { eng, vie }; 