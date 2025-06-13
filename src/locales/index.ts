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
};

export default translations; 