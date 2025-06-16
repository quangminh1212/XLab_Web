import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Kiểm tra xem locale có hợp lệ không
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`./i18n/locales/${locale}`)).default,
    timeZone: 'Asia/Ho_Chi_Minh',
  };
}); 