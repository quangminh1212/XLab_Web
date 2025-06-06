import { ReactNode } from 'react';
import { locales } from '@/middleware';

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale;
  
  // Validate that the incoming locale is valid
  const isValidLocale = locales.includes(locale);
  
  if (!isValidLocale) {
    // This shouldn't happen due to middleware, but just in case
    return null;
  }

  return <>{children}</>;
} 