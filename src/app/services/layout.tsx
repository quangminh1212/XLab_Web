import { Metadata } from 'next';
import { ReactNode } from 'react';
import { ServicesLayoutClient } from './layout.client';

// Static metadata for server-side rendering
export const metadata: Metadata = {
  title: 'Dịch vụ | XLab - Phần mềm và Dịch vụ',
  description: 'Danh sách các dịch vụ cao cấp với giá tốt nhất thị trường',
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <ServicesLayoutClient>{children}</ServicesLayoutClient>;
}
