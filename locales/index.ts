import enTranslations from './en/translations.json';
import viTranslations from './vi/translations.json';

export interface Translations {
  [key: string]: string;
}

interface LocaleData {
  [language: string]: Translations;
}

const locales: LocaleData = {
  en: enTranslations,
  vi: viTranslations
};

export default locales; 