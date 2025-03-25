import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XLab - Phần mềm chất lượng cao',
  description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
  keywords: 'phần mềm, software, ứng dụng, xlab, công cụ',
  openGraph: {
    title: 'XLab - Phần mềm chất lượng cao',
    description: 'XLab cung cấp phần mềm chất lượng cao với giá cả phải chăng',
    url: 'https://xlab.vn',
    siteName: 'XLab',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'XLab - Phần mềm chất lượng cao',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
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
              <a href="/">XLab</a>
            </div>
            <nav className="main-nav">
              <ul>
                <li><a href="/products">Sản phẩm</a></li>
                <li><a href="/pricing">Bảng giá</a></li>
                <li><a href="/support">Hỗ trợ</a></li>
                <li><a href="/about">Giới thiệu</a></li>
                <li><a href="/contact">Liên hệ</a></li>
              </ul>
            </nav>
            <div className="user-actions">
              <a href="/login" className="btn btn-light">Đăng nhập</a>
              <a href="/signup" className="btn btn-primary">Đăng ký</a>
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
                  <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                  <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                </div>
              </div>
              <div className="footer-col">
                <h4>Sản phẩm</h4>
                <ul>
                  <li><a href="/products/design">XLab Design</a></li>
                  <li><a href="/products/analytics">XLab Analytics</a></li>
                  <li><a href="/products/security">XLab Security</a></li>
                  <li><a href="/products/developer">XLab Developer</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Hỗ trợ</h4>
                <ul>
                  <li><a href="/support/documentation">Tài liệu</a></li>
                  <li><a href="/support/faq">FAQ</a></li>
                  <li><a href="/support/community">Cộng đồng</a></li>
                  <li><a href="/support/ticket">Gửi yêu cầu hỗ trợ</a></li>
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
                <a href="/privacy">Chính sách bảo mật</a>
                <a href="/terms">Điều khoản sử dụng</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 