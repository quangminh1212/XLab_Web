import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dịch vụ | XLab - Phần mềm và Dịch vụ',
  description: 'Khám phá các dịch vụ công nghệ chuyên nghiệp của XLab dành cho doanh nghiệp',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="services-layout">
      {children}
    </div>
  )
} 