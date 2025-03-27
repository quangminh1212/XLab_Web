import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              XLab
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-dark hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link href="/products" className="text-dark hover:text-primary transition-colors">
              Sản phẩm
            </Link>
            <Link href="/services" className="text-dark hover:text-primary transition-colors">
              Dịch vụ
            </Link>
            <Link href="/contact" className="text-dark hover:text-primary transition-colors">
              Liên hệ
            </Link>
          </div>
          
          <div className="flex items-center">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Dùng thử miễn phí
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 