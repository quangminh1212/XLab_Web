import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hỗ trợ & FAQ | XLab - Phần mềm và Dịch vụ',
  description: 'Trung tâm hỗ trợ, câu hỏi thường gặp và tài nguyên của XLab',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <div className="support-layout">{children}</div>;
}
