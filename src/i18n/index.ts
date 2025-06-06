import { createIntl } from '@formatjs/intl';
import { locales } from '../middleware';

// Import messages for each supported locale
import vi from './messages/vi';
import en from './messages/en';

// Message collections for all supported locales
export const messages = {
  vi,
  en,
};

// Create a cache for intl instances
const intlCache: Record<string, any> = {};

// Function to get an intl instance for a specific locale
export async function getIntl(locale: string) {
  // Use the locale if it's supported, otherwise use the default locale
  const selectedLocale = locales.includes(locale) ? locale : 'vi';
  
  // Return from cache if available
  if (intlCache[selectedLocale]) {
    return intlCache[selectedLocale];
  }
  
  // Create a new intl instance with the locale's messages
  const intl = createIntl({
    locale: selectedLocale,
    messages: messages[selectedLocale as keyof typeof messages],
  });
  
  // Cache the instance for future use
  intlCache[selectedLocale] = intl;
  
  return intl;
}

// Function to get the locale from URL path
export function getLocaleFromPath(path: string): string {
  if (!path) return 'vi';
  
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (locales.includes(firstSegment)) {
    return firstSegment;
  }
  
  return 'vi';
} 