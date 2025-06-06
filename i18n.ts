import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'vi'];

export default getRequestConfig(async (params) => {
  const locale = params.locale;

  // Validate that the incoming `locale` parameter is a valid locale
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
}); 