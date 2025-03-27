import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XLab - Giải pháp phần mềm tiên tiến",
  description: "Website giới thiệu và bán phần mềm của công ty XLab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.svg" alt="XLab Logo" width={120} height={40} />
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><Link href="/" className="font-medium text-gray-700 hover:text-blue-600 transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition">Trang chủ</Link></li>
                <li><Link href="/products" className="font-medium text-gray-700 hover:text-blue-600 transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition">Sản phẩm</Link></li>
                <li><Link href="/services" className="font-medium text-gray-700 hover:text-blue-600 transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition">Dịch vụ</Link></li>
                <li><Link href="/contact" className="font-medium text-gray-700 hover:text-blue-600 transition duration-150 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition">Liên hệ</Link></li>
              </ul>
            </nav>
            <div className="hidden md:block">
              <Link href="/contact" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition duration-200 shadow-sm hover:shadow">
                Tư vấn miễn phí
              </Link>
            </div>
            <button className="md:hidden text-gray-600 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div>
                <Image src="/images/logo.svg" alt="XLab Logo" width={120} height={40} className="mb-4 invert" />
                <p className="text-gray-400 mb-6">Giải pháp phần mềm tiên tiến giúp doanh nghiệp tối ưu hóa quy trình làm việc và tăng năng suất.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 5.3c-.7.3-1.5.6-2.4.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.8-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.9-4.1 4.2 0 .3 0 .6.1.9-3.4-.2-6.5-1.8-8.5-4.3-.4.6-.6 1.3-.6 2.1 0 1.5.7 2.8 1.8 3.5-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.7 3.3 4.1-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.7 2.1 2.9 3.9 2.9-1.4 1.1-3.2 1.8-5.1 1.8-.3 0-.7 0-1-.1 1.8 1.2 4 1.9 6.3 1.9 7.6 0 11.8-6.3 11.8-11.8v-.5c.8-.6 1.5-1.3 2.1-2.2z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.5 8.5A1.5 1.5 0 1 1 7 7a1.5 1.5 0 0 1 1.5 1.5zM7 17v-6h2v6H7zm6 0v-6h-2v6h2zm2-9.5A1.5 1.5 0 1 1 17 9a1.5 1.5 0 0 1-1.5-1.5zm2 3.5h-2v6h2v-6z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.128 15.272C13.571 15.272 14 15.701 14 16.146C14 16.59 13.571 17.022 13.128 17.022C12.683 17.022 12.255 16.59 12.255 16.146C12.255 15.701 12.683 15.272 13.128 15.272ZM9.047 15.272C9.493 15.272 9.919 15.701 9.919 16.146C9.919 16.59 9.493 17.022 9.047 17.022C8.602 17.022 8.174 16.59 8.174 16.146C8.174 15.701 8.602 15.272 9.047 15.272ZM21.368 9.543C19.71 8.554 18.178 8 16.245 8C14.311 8 12.778 8.554 11.121 9.543C9.464 10.532 8.603 12.117 8.603 14.045V20.772C8.603 21.436 9.142 22 9.799 22H22.692C23.348 22 23.887 21.436 23.887 20.772V14.045C23.887 12.117 23.026 10.532 21.368 9.543ZM11.121 11.436C12.392 10.662 13.725 10.227 15.287 10.109V11.872C14.201 11.994 13.236 12.343 12.356 12.93C11.476 13.516 11.036 14.222 11.036 15.044C11.036 15.916 11.538 16.65 12.543 17.245C13.548 17.84 14.731 18.137 16.093 18.137C17.455 18.137 18.637 17.84 19.642 17.245C20.648 16.65 21.15 15.916 21.15 15.044C21.15 14.222 20.71 13.516 19.83 12.93C18.95 12.343 17.985 11.994 16.899 11.872V10.109C18.461 10.227 19.794 10.662 21.064 11.436C22.335 12.209 22.971 13.079 22.971 14.045V20.772C22.971 20.896 22.856 21 22.692 21H9.799C9.634 21 9.519 20.896 9.519 20.772V14.045C9.519 13.079 10.155 12.209 11.426 11.436H11.121Z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
                <ul className="space-y-3">
                  <li><Link href="/products/crm" className="text-gray-400 hover:text-white transition">XLab CRM</Link></li>
                  <li><Link href="/products/erp" className="text-gray-400 hover:text-white transition">XLab ERP</Link></li>
                  <li><Link href="/products/analytics" className="text-gray-400 hover:text-white transition">XLab Analytics</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
                <ul className="space-y-3">
                  <li><Link href="/services" className="text-gray-400 hover:text-white transition">Tư vấn giải pháp</Link></li>
                  <li><Link href="/services" className="text-gray-400 hover:text-white transition">Phát triển phần mềm</Link></li>
                  <li><Link href="/services" className="text-gray-400 hover:text-white transition">Triển khai & Tích hợp</Link></li>
                  <li><Link href="/services" className="text-gray-400 hover:text-white transition">Hỗ trợ & Bảo trì</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-400">Tòa nhà XLab, 123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400">info@xlab.vn</span>
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-400">0123 456 789</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
              <p>© {new Date().getFullYear()} XLab. Tất cả quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
