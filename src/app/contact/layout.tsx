import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ | XLab - Phần mềm và Dịch vụ',
  description: 'Liên hệ với XLab để được tư vấn về các giải pháp phần mềm và dịch vụ công nghệ',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="contact-layout">
      {children}
    </div>
  )
} 