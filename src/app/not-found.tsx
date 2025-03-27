import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">Không tìm thấy trang</h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary px-6 py-3">
            Về trang chủ
          </Link>
          <Link href="/contact" className="btn border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3">
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  )
} 