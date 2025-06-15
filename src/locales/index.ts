// Vietnamese translations
import viCommon from './vi/common';
import viHome from './vi/home';
import viProducts from './vi/products';
import viAuth from './vi/auth';
import viFooter from './vi/footer';
import viAccount from './vi/account';

// English translations
import enCommon from './en/common';
import enHome from './en/home';
import enProducts from './en/products';
import enAuth from './en/auth';
import enFooter from './en/footer';
import enAccount from './en/account';

// More language files will be imported here as they are created

export const translations = {
  vi: {
    ...viCommon,
    ...viHome,
    ...viProducts,
    ...viAuth,
    ...viFooter,
    ...viAccount,
    // Add more Vietnamese translation files here
  },
  en: {
    ...enCommon,
    ...enHome,
    ...enProducts,
    ...enAuth,
    ...enFooter,
    ...enAccount,
    // Add more English translation files here
  },
  // Add more languages here in the future
};

export default translations; 