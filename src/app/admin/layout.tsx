import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản trị | XLab - Phần mềm và Dịch vụ',
  description: 'Trang quản trị XLab - Chỉ dành cho quản trị viên',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 