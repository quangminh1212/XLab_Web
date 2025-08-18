import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Dịch vụ | XLab - Phần mềm và Dịch vụ',
  description: 'Khám phá các dịch vụ công nghệ của XLab',
  alternates: {
    canonical: new URL('/services', siteConfig.url).toString(),
    languages: {
      'vi-VN': new URL('/services', siteConfig.url).toString(),
      'en-US': new URL('/en/services', siteConfig.url).toString(),
    },
  },
};

