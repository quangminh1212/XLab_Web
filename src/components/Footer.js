import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold">XLab</h3>
            <p className="mt-2 text-sm text-gray-400">Giải pháp phần mềm tối ưu cho doanh nghiệp Việt</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Sản phẩm</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">XLab ERP</a>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">XLab CRM</a>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">XLab Analytics</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Hỗ trợ</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">Trung tâm hỗ trợ</a>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">Tài liệu</a>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">FAQ</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Liên kết</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">Tuyển dụng</a>
                </Link>
              </li>
              <li>
                <Link href="/#">
                  <a className="text-sm text-gray-400 hover:text-white">Đối tác</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} XLab. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
} 