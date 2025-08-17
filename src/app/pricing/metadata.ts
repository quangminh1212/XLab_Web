import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Báo giá | XLab - Phần mềm và Dịch vụ',
  description: 'Các gói dịch vụ với giá linh hoạt, phù hợp nhu cầu doanh nghiệp',
  alternates: {
    canonical: new URL('/pricing', siteConfig.url).toString(),
    languages: {
      'vi-VN': new URL('/pricing', siteConfig.url).toString(),
      'en-US': new URL('/pricing', siteConfig.url).toString(),
    },
  },
};

