import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Đăng nhập | XLab - Phần mềm và Dịch vụ',
  description: 'Đăng nhập vào tài khoản XLab của bạn để truy cập phần mềm và dịch vụ',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      {children}
    </div>
  )
} 