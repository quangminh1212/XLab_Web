import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Câu hỏi thường gặp (FAQ) | XLab - Phần mềm và Dịch vụ',
  description: 'Các câu hỏi thường gặp và giải đáp về sản phẩm, dịch vụ của XLab',
}

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="faqs-layout">
      {children}
    </div>
  )
} 