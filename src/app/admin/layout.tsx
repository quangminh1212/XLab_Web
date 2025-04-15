import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý sản phẩm | XLab - Phần mềm và Dịch vụ',
  description: 'Trang quản lý sản phẩm XLab - Thêm sản phẩm mới không cần đăng nhập',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 