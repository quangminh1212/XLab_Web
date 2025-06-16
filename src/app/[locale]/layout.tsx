import '../../styles/globals.css';
import '../../styles/app-layout.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { Inter } from 'next/font/google';

// Bọc các component client
import { ClientLayoutWrapper } from '@/components/layout';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
});

// Metadata mặc định
export const metadata: Metadata = {
  title: 'XLab - Software and Services',
  description: 'XLab - Software and Services',
};

// Tạo các đường dẫn động
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Props cho RootLayout component
interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ 
  children, 
  params: { locale } 
}: RootLayoutProps) {
  // Kiểm tra locale có hợp lệ không, nếu không thì trả về 404
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Lấy dữ liệu dịch từ API
  let messages;
  try {
    messages = (await import(`@/i18n/locales/${locale}`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 