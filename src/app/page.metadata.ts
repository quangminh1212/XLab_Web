import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'vi-VN': siteConfig.url,
      'en-US': siteConfig.url,
    },
  },

  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
};

