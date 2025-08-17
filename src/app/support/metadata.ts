import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Hỗ trợ & FAQ | XLab - Phần mềm và Dịch vụ',
  description: 'Trung tâm hỗ trợ, câu hỏi thường gặp và tài nguyên của XLab',
  alternates: {
    canonical: new URL('/support', siteConfig.url).toString(),
    languages: {
      'vi-VN': new URL('/support', siteConfig.url).toString(),
      'en-US': new URL('/support', siteConfig.url).toString(),
    },
  },
};

