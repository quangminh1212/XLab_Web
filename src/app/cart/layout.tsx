import { Metadata } from 'next';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Import the client component with dynamic import
const CartLayoutClient = dynamic(() => import('./layout.client'));

// Static metadata for server-side rendering
export const metadata: Metadata = {
  title: 'Giỏ hàng | XLab - Phần mềm và Dịch vụ',
  description: 'Giỏ hàng của bạn tại XLab - Phần mềm và Dịch vụ',
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CartLayoutClient>{children}</CartLayoutClient>
    </>
  );
}
