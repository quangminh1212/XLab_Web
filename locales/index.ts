// Import Vietnamese translations
import viAdminTranslations from './vi/admin.json';
import viTermsTranslations from './vi/terms.json';
import viNavigationTranslations from './vi/navigation.json';
import viAuthTranslations from './vi/auth.json';
import viHomeTranslations from './vi/home.json';
import viProductTranslations from './vi/product.json';
import viAboutTranslations from './vi/about.json';
import viCommonTranslations from './vi/common.json';
import viPagesTranslations from './vi/pages.json';
import viPaymentTranslations from './vi/payment.json';
import viSystemTranslations from './vi/system.json';
import viConfigTranslations from './vi/config.json';
import viUITranslations from './vi/ui.json';

// Import English translations
import enAdminTranslations from './en/admin.json';
import enTermsTranslations from './en/terms.json';
import enNavigationTranslations from './en/navigation.json';
import enAuthTranslations from './en/auth.json';
import enHomeTranslations from './en/home.json';
import enProductTranslations from './en/product.json';
import enAboutTranslations from './en/about.json';
import enCommonTranslations from './en/common.json';
import enPagesTranslations from './en/pages.json';
import enPaymentTranslations from './en/payment.json';
import enSystemTranslations from './en/system.json';
import enConfigTranslations from './en/config.json';
import enUITranslations from './en/ui.json';

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
  ...prefixKeys(viSystemTranslations, 'system'),
  ...prefixKeys(viConfigTranslations, 'config'),
  ...prefixKeys(viUITranslations, 'ui')
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
  ...prefixKeys(enSystemTranslations, 'system'),
  ...prefixKeys(enConfigTranslations, 'config'),
  ...prefixKeys(enUITranslations, 'ui')
};

const locales: LocaleData = {
  en: enTranslations,
  vi: viTranslations
};

export default locales; 