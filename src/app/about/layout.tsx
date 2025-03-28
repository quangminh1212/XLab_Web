import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu | XLab - Phần mềm và Dịch vụ',
  description: 'Tìm hiểu về XLab - Đơn vị tiên phong trong lĩnh vực phát triển phần mềm và các giải pháp công nghệ tại Việt Nam',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="about-layout">
      {children}
    </div>
  )
} 