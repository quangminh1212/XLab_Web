import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const withCanonical = (pathname: string): Pick<Metadata, 'alternates' | 'openGraph' | 'twitter'> => {
  const url = new URL(pathname, siteConfig.url).toString();
  return {
    alternates: { canonical: url },
    openGraph: { type: 'website', url },
    twitter: { card: 'summary_large_image' },
  };
};

export const withHreflang = (pathname: string): Pick<Metadata, 'alternates'> => {
  const base = new URL(pathname, siteConfig.url).toString();
  return {
    alternates: {
      canonical: base,
      languages: {
        'vi-VN': base,
        'en-US': base, // Trỏ cùng URL vì nội dung thay đổi theo i18n client, không có prefix riêng
      },
    },
  };
};

