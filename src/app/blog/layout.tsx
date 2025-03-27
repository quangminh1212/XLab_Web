import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | XLab - Phần mềm và Dịch vụ',
  description: 'Tin tức, cập nhật và kiến thức mới nhất về công nghệ, phát triển phần mềm và giải pháp doanh nghiệp',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  )
} 