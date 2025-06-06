import { ReactNode } from 'react';
import { locales } from '@/middleware';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await params để lấy giá trị locale một cách đúng đắn
  const { locale } = await params;
  
  // Validate that the incoming locale is valid
  const isValidLocale = locales.includes(locale);
  
  if (!isValidLocale) {
    // This shouldn't happen due to middleware, but just in case
    return null;
  }

  return <>{children}</>;
} 