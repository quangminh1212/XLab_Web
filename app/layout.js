import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'XLab - Phần mềm và Dịch vụ',
  description: 'XLab cung cấp các giải pháp phần mềm và dịch vụ công nghệ hàng đầu.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 