import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href="/">
            <a className="text-3xl font-bold text-primary">XLab</a>
          </Link>
          <nav className="flex space-x-6">
            <Link href="/">
              <a className="text-gray-700 hover:text-primary">Trang chủ</a>
            </Link>
            <Link href="/#products">
              <a className="text-gray-700 hover:text-primary">Sản phẩm</a>
            </Link>
            <Link href="/#services">
              <a className="text-gray-700 hover:text-primary">Dịch vụ</a>
            </Link>
            <Link href="/#about">
              <a className="text-gray-700 hover:text-primary">Về chúng tôi</a>
            </Link>
            <Link href="/#contact">
              <a className="text-gray-700 hover:text-primary">Liên hệ</a>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 