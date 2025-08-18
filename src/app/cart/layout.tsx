import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Giỏ hàng | XLab - Phần mềm và Dịch vụ',
  description: 'Giỏ hàng của bạn tại XLab - Phần mềm và Dịch vụ',
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
