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

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Sử dụng toán tử optional chaining để tránh lỗi nếu params là undefined
  const locale = params?.locale;
  
  // Validate that the incoming locale is valid
  const isValidLocale = locale && locales.includes(locale);
  
  if (!isValidLocale) {
    // This shouldn't happen due to middleware, but just in case
    return null;
  }

  return <>{children}</>;
} 