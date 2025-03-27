import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">XLab</div>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="/" className="font-medium hover:text-blue-600">Trang chủ</a></li>
                <li><a href="/products" className="font-medium hover:text-blue-600">Sản phẩm</a></li>
                <li><a href="/services" className="font-medium hover:text-blue-600">Dịch vụ</a></li>
                <li><a href="/contact" className="font-medium hover:text-blue-600">Liên hệ</a></li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
        <footer className="bg-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <div className="text-xl font-bold text-blue-600 mb-2">XLab</div>
                <p className="text-gray-600">Giải pháp phần mềm tiên tiến</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Liên hệ</h3>
                <p className="text-gray-600">Email: info@xlab.vn</p>
                <p className="text-gray-600">Điện thoại: 0123 456 789</p>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-4 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} XLab. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
