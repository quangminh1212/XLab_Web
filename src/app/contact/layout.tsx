import type { Metadata } from 'next';

import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Liên hệ | XLab - Phần mềm và Dịch vụ',
  description: 'Liên hệ với XLab để được tư vấn về các giải pháp phần mềm và dịch vụ công nghệ',
  alternates: {
    canonical: new URL('/contact', siteConfig.url).toString(),
    languages: {
      'vi-VN': new URL('/contact', siteConfig.url).toString(),
      'en-US': new URL('/contact', siteConfig.url).toString(),
    },
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <div className="contact-layout">{children}</div>;
}
