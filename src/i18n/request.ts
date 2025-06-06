import {getRequestConfig} from 'next-intl/server';

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (locale !== 'en' && locale !== 'vi') {
    locale = 'vi'; // Mặc định về tiếng Việt nếu không phải en hoặc vi
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

// Helpers để lấy path theo locale
export function getPathWithLocale(path: string, locale: string) {
  return `/${locale}${path}`;
}

// Lấy locale từ request URL
export function getLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    return segments[0];
  }
  return 'vi'; // Default locale
} 