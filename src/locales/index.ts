// Vietnamese translations
import viCommon from './vi/common';
import viHome from './vi/home';
import viProducts from './vi/products';
import viAuth from './vi/auth';

// English translations
import enCommon from './en/common';
import enHome from './en/home';
import enProducts from './en/products';
import enAuth from './en/auth';

// More language files will be imported here as they are created

export const translations = {
  vi: {
    ...viCommon,
    ...viHome,
    ...viProducts,
    ...viAuth,
    // Add more Vietnamese translation files here
  },
  en: {
    ...enCommon,
    ...enHome,
    ...enProducts,
    ...enAuth,
    // Add more English translation files here
  },
  // Add more languages here in the future
};

export default translations; 