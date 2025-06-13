import vi from './vi';
import en from './en';
import es from './es';

export type Language = 'vi' | 'en' | 'es';

export const translations: Record<Language, Record<string, string>> = {
  vi,
  en,
  es
};

export default translations; 