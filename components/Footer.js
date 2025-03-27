import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">XLab</h3>
            <p className="mb-4">Giải pháp phần mềm chuyên nghiệp cho doanh nghiệp của bạn</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-secondary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              <li><Link href="/products/software1" className="hover:text-secondary">Phần mềm 1</Link></li>
              <li><Link href="/products/software2" className="hover:text-secondary">Phần mềm 2</Link></li>
              <li><Link href="/products/software3" className="hover:text-secondary">Phần mềm 3</Link></li>
              <li><Link href="/products/software4" className="hover:text-secondary">Phần mềm 4</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li><Link href="/services/consulting" className="hover:text-secondary">Tư vấn</Link></li>
              <li><Link href="/services/implementation" className="hover:text-secondary">Triển khai</Link></li>
              <li><Link href="/services/training" className="hover:text-secondary">Đào tạo</Link></li>
              <li><Link href="/services/support" className="hover:text-secondary">Hỗ trợ kỹ thuật</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <address className="not-italic">
              <p className="mb-2">123 Đường ABC, Quận XYZ</p>
              <p className="mb-2">TP. Hồ Chí Minh, Việt Nam</p>
              <p className="mb-2">Email: info@xlab.vn</p>
              <p className="mb-2">Điện thoại: (84) 28 1234 5678</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} XLab. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-secondary">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:text-secondary">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 