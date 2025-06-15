import { ReactNode } from 'react';
import { createTranslator } from 'next-intl';

async function getMessages(locale: string) {
  try {
    return (await import(`@/i18n/locales/${locale}`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    // Fallback to default locale if messages couldn't be loaded
    return (await import('@/i18n/locales/vi')).default;
  }
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const messages = await getMessages(locale);
  
  // Use translations from the locale
  const t = createTranslator({ locale, messages });
  
  return {
    title: t('common.siteTitle', { default: 'XLab - Giải pháp phần mềm tích hợp AI' }),
    description: t('common.siteDescription', { default: 'Nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến' }),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return children;
} 