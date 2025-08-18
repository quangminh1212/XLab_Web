import type { Metadata } from 'next';
import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Sản phẩm | XLab - Phần mềm và Dịch vụ',
  description:
    'Khám phá các sản phẩm phần mềm hiện đại của XLab được thiết kế riêng cho doanh nghiệp của bạn',
  alternates: {
    canonical: new URL('/products', siteConfig.url).toString(),
    languages: {
      'vi-VN': new URL('/products', siteConfig.url).toString(),
      'en-US': new URL('/en/products', siteConfig.url).toString(),
    },
  },
  openGraph: {
    type: 'website',
    url: new URL('/products', siteConfig.url).toString(),
    title: 'Sản phẩm | XLab - Phần mềm và Dịch vụ',
    description:
      'Khám phá các sản phẩm phần mềm hiện đại của XLab được thiết kế riêng cho doanh nghiệp của bạn',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sản phẩm | XLab - Phần mềm và Dịch vụ',
    description:
      'Khám phá các sản phẩm phần mềm hiện đại của XLab được thiết kế riêng cho doanh nghiệp của bạn',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <div className="products-layout">{children}</div>;
}
export const dynamic = 'force-static';

