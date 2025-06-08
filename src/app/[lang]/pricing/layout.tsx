import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Báo giá | XLab - Phần mềm và Dịch vụ',
  description:
    'Khám phá các gói phần mềm và dịch vụ công nghệ với giá cả linh hoạt và phù hợp với nhu cầu doanh nghiệp của bạn',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <div className="pricing-layout">{children}</div>;
}
