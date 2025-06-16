import '@/styles/globals.css';
import '../styles/app-layout.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { siteConfig } from '@/config/siteConfig';
import { ClientLayoutWrapper } from '@/components/layout';
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
});

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00A19A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  redirect(`/${defaultLocale}`);
}
