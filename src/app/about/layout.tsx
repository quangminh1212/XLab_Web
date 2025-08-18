import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu | XLab',
  description: 'Về XLab - giải pháp phần mềm và dịch vụ công nghệ',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <div className="about-layout">{children}</div>;
}
