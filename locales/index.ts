// Import Vietnamese translations
import viAdminTranslations from './vi/features/admin.json';
import viTermsTranslations from './vi/features/terms.json';
import viNavigationTranslations from './vi/features/navigation.json';
import viAuthTranslations from './vi/features/auth.json';
import viHomeTranslations from './vi/features/home.json';
import viProductTranslations from './vi/features/product.json';
import viAboutTranslations from './vi/features/about.json';
import viCommonTranslations from './vi/features/common.json';
import viPagesTranslations from './vi/features/pages.json';
import viPaymentTranslations from './vi/features/payment.json';

// Import English translations
import enAdminTranslations from './en/features/admin.json';
import enTermsTranslations from './en/features/terms.json';
import enNavigationTranslations from './en/features/navigation.json';
import enAuthTranslations from './en/features/auth.json';
import enHomeTranslations from './en/features/home.json';
import enProductTranslations from './en/features/product.json';
import enAboutTranslations from './en/features/about.json';
import enCommonTranslations from './en/features/common.json';
import enPagesTranslations from './en/features/pages.json';
import enPaymentTranslations from './en/features/payment.json';

export interface Translations {
  [key: string]: string;
}

interface LocaleData {
  [language: string]: Translations;
}

// Helper function to prefix keys with namespace
const prefixKeys = (obj: any, prefix: string): Translations => {
  return Object.keys(obj).reduce((result: Translations, key) => {
    result[`${prefix}.${key}`] = obj[key];
    return result;
  }, {});
};

// Combine translations with namespaces
const viTranslations = {
  ...prefixKeys(viAdminTranslations, 'admin'),
  ...prefixKeys(viTermsTranslations, 'terms'),
  ...prefixKeys(viNavigationTranslations, 'nav'),
  ...prefixKeys(viAuthTranslations, 'auth'),
  ...prefixKeys(viHomeTranslations, 'home'),
  ...prefixKeys(viProductTranslations, 'product'),
  ...prefixKeys(viAboutTranslations, 'about'),
  ...prefixKeys(viCommonTranslations, 'common'),
  ...prefixKeys(viPagesTranslations, 'pages'),
  ...prefixKeys(viPaymentTranslations, 'payment'),
};

const enTranslations = {
  ...prefixKeys(enAdminTranslations, 'admin'),
  ...prefixKeys(enTermsTranslations, 'terms'),
  ...prefixKeys(enNavigationTranslations, 'nav'),
  ...prefixKeys(enAuthTranslations, 'auth'),
  ...prefixKeys(enHomeTranslations, 'home'),
  ...prefixKeys(enProductTranslations, 'product'),
  ...prefixKeys(enAboutTranslations, 'about'),
  ...prefixKeys(enCommonTranslations, 'common'),
  ...prefixKeys(enPagesTranslations, 'pages'),
  ...prefixKeys(enPaymentTranslations, 'payment'),
};

const locales: LocaleData = {
  en: enTranslations,
  vi: viTranslations
};

export default locales; 