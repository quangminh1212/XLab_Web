import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XLab - Phần mềm chất lượng cao',
  description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
  keywords: 'phần mềm, software, ứng dụng, xlab, công cụ',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'XLab - Phần mềm chất lượng cao',
    description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
    url: 'https://xlab.vn',
    siteName: 'XLab',
    images: [
      {
        url: '/images/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'XLab - Phần mềm chất lượng cao',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XLab - Phần mềm chất lượng cao',
    description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
    images: ['/images/og-image.svg'],
    creator: '@xlabvn',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <header className="header">
          <div className="container">
            <div className="logo">
              <Link href="/">XLab</Link>
            </div>
            <nav className="main-nav">
              <ul>
                <li><Link href="/products">Sản phẩm</Link></li>
                <li><Link href="/pricing">Bảng giá</Link></li>
                <li><Link href="/support">Hỗ trợ</Link></li>
                <li><Link href="/about">Giới thiệu</Link></li>
                <li><Link href="/contact">Liên hệ</Link></li>
              </ul>
            </nav>
            <div className="user-actions">
              <Link href="/login" className="btn btn-light">Đăng nhập</Link>
              <Link href="/signup" className="btn btn-primary">Đăng ký</Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-col">
                <h3>XLab</h3>
                <p>Công ty phát triển phần mềm chất lượng cao tại Việt Nam</p>
                <div className="social-links">
                  <Link href="https://facebook.com/xlabvn" aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                  </Link>
                  <Link href="https://twitter.com/xlabvn" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link href="https://linkedin.com/company/xlabvn" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </Link>
                </div>
              </div>
              <div className="footer-col">
                <h4>Sản phẩm</h4>
                <ul>
                  <li><Link href="/products/design">XLab Design</Link></li>
                  <li><Link href="/products/analytics">XLab Analytics</Link></li>
                  <li><Link href="/products/security">XLab Security</Link></li>
                  <li><Link href="/products/developer">XLab Developer</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Hỗ trợ</h4>
                <ul>
                  <li><Link href="/support/documentation">Tài liệu</Link></li>
                  <li><Link href="/support/faq">FAQ</Link></li>
                  <li><Link href="/support/community">Cộng đồng</Link></li>
                  <li><Link href="/support/ticket">Gửi yêu cầu hỗ trợ</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Liên hệ</h4>
                <address>
                  <p>Số 10, Đường Trần Phú, Hà Nội</p>
                  <p>Email: info@xlab.vn</p>
                  <p>Điện thoại: +84 123 456 789</p>
                </address>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} XLab. Tất cả quyền được bảo lưu.</p>
              <div className="footer-links">
                <Link href="/privacy">Chính sách bảo mật</Link>
                <Link href="/terms">Điều khoản sử dụng</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 