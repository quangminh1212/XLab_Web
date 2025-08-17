import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Sản phẩm | XLab - Phần mềm và Dịch vụ',
  description: 'Khám phá các sản phẩm phần mềm hiện đại của XLab',
  alternates: { canonical: new URL('/products', siteConfig.url).toString() },
};

