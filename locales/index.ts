// Import Vietnamese translations
import viAdminTranslations from './vie/admin.json';
import viTermsTranslations from './vie/terms.json';
import viNavigationTranslations from './vie/navigation.json';
import viAuthTranslations from './vie/auth.json';
import viHomeTranslations from './vie/home.json';
import viProductTranslations from './vie/product.json';
import viAboutTranslations from './vie/about.json';
import viCommonTranslations from './vie/common.json';
import viPagesTranslations from './vie/pages.json';
import viPaymentTranslations from './vie/payment.json';
import viSystemTranslations from './vie/system.json';
import viConfigTranslations from './vie/config.json';
import viUITranslations from './vie/ui.json';
import viFooterTranslations from './vie/footer.json';

// Import English translations
import enAdminTranslations from './eng/admin.json';
import enTermsTranslations from './eng/terms.json';
import enNavigationTranslations from './eng/navigation.json';
import enAuthTranslations from './eng/auth.json';
import enHomeTranslations from './eng/home.json';
import enProductTranslations from './eng/product.json';
import enAboutTranslations from './eng/about.json';
import enCommonTranslations from './eng/common.json';
import enPagesTranslations from './eng/pages.json';
import enPaymentTranslations from './eng/payment.json';
import enSystemTranslations from './eng/system.json';
import enConfigTranslations from './eng/config.json';
import enUITranslations from './eng/ui.json';
import enFooterTranslations from './eng/footer.json';

export interface Translations {
  [key: string]: string;
}

interface LocaleData {
  [language: string]: Translations;
}

// Helper function to prefix keys with namespace and handle nested objects
const prefixKeys = (obj: any, prefix: string, currentPath: string = ''): Translations => {
  if (!obj) {
    console.warn(`Empty or invalid translation object for prefix: ${prefix}`);
    return {};
  }
  
  let result: Translations = {};
  
  Object.keys(obj).forEach((key) => {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;
    const value = obj[key];
    
    if (value === null || value === undefined) {
      console.warn(`Null or undefined translation value for key: ${prefix}.${fullPath}`);
      return;
    }
    
    // Handle nested objects (recursive)
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedKeys = prefixKeys(value, prefix, fullPath);
      result = { ...result, ...nestedKeys };
    } else {
      // For array or primitive values
      result[`${prefix}.${fullPath}`] = value;
    }
  });
  
  return result;
};

// Direct assignment for simple keys to avoid prefixing issues
const assignDirectKeyValues = (translations: Record<string, any>): Translations => {
  const result: Translations = {};
  
  Object.keys(translations).forEach(key => {
    result[key] = translations[key];
  });
  
  return result;
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
  ...prefixKeys(viUITranslations, 'ui'),
  ...prefixKeys(viFooterTranslations, 'footer')
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
  ...prefixKeys(enUITranslations, 'ui'),
  ...prefixKeys(enFooterTranslations, 'footer')
};

// Validate translations in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Loaded translations for Vietnamese:', Object.keys(viTranslations).length);
  console.log('Loaded translations for English:', Object.keys(enTranslations).length);
}

const locales: LocaleData = {
  eng: enTranslations,
  vie: viTranslations
};

export default locales; 