<<<<<<< HEAD
import vi from './vi';
import en from './en';
import es from './es';

export type Language = 'vi' | 'en' | 'es';

<<<<<<< HEAD
export const translations = {
=======
export const translations: Record<Language, Record<string, string>> = {
>>>>>>> parent of 8b6c7b2f (Merge commit '2e12e51b9d6fbcf0295e287983cd4b62520f02ad')
  vi,
  en,
  es
=======
// Vietnamese translations
import viCommon from './vi/common';
import viHome from './vi/home';
import viProducts from './vi/products';
import viAuth from './vi/auth';
import viFooter from './vi/footer';

// English translations
import enCommon from './en/common';
import enHome from './en/home';
import enProducts from './en/products';
import enAuth from './en/auth';
import enFooter from './en/footer';

// More language files will be imported here as they are created

export const translations = {
  vi: {
    ...viCommon,
    ...viHome,
    ...viProducts,
    ...viAuth,
    ...viFooter,
    // Add more Vietnamese translation files here
  },
  en: {
    ...enCommon,
    ...enHome,
    ...enProducts,
    ...enAuth,
    ...enFooter,
    // Add more English translation files here
  },
  // Add more languages here in the future
>>>>>>> dev_11
};

export default translations; 