import vi from './vi';
import en from './en';

// Ensure we have valid objects to avoid JSON parse errors
const defaultTranslations = {
  vi: {},
  en: {}
};

const translations = {
  vi: vi || defaultTranslations.vi,
  en: en || defaultTranslations.en
};

export type Language = 'vi' | 'en';

export default translations;
