import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm | XLab - Phần mềm và Dịch vụ',
  description:
    'Khám phá các sản phẩm phần mềm hiện đại của XLab được thiết kế riêng cho doanh nghiệp của bạn',
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <div className="products-layout">{children}</div>;
}
