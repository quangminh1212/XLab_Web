import { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Tài khoản | XLab - Phần mềm và Dịch vụ',
  description: 'Quản lý tài khoản, giấy phép và lịch sử mua hàng của bạn tại XLab',
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
} 