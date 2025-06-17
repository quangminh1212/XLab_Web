import { Metadata } from 'next';
import { ReactNode } from 'react';
import { CartLayoutClient } from './layout.client';

// Static metadata for server-side rendering
export const metadata: Metadata = {
  title: 'Giỏ hàng | XLab - Phần mềm và Dịch vụ',
  description: 'Giỏ hàng của bạn tại XLab - Phần mềm và Dịch vụ',
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <CartLayoutClient>{children}</CartLayoutClient>;
}
