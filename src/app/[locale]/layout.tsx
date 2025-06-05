import './globals.css';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n';
import { locales } from '@/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';
import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/siteConfig';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: siteConfig.seo.titleTemplate,
    default: siteConfig.seo.defaultTitle,
  },
  description: siteConfig.seo.defaultDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legal.companyName, url: siteConfig.url }],
  keywords: [
    'phần mềm',
    'dịch vụ CNTT',
    'giải pháp doanh nghiệp',
    'phát triển phần mềm',
    'cloud services',
  ],
  category: 'technology',
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.seo.defaultTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    creator: siteConfig.seo.twitterHandle,
    images: [siteConfig.seo.ogImage],
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/images/topup.png' },
      { url: '/images/topup.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/topup.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/images/topup.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/images/topup.png', color: '#2563EB' }],
  },
  other: {
    'msapplication-TileColor': '#00A19A',
    'theme-color': '#ffffff',
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Await params before using
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages({ locale: locale as "vi" | "en" });

  return (
    <html lang={locale} className={`${inter.variable} scroll-smooth`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayoutWrapper>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ClientLayoutWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 