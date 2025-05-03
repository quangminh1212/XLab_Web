import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="pt-16 pb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-gray-900">X</span>
          <span className="text-teal-600">Lab</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Phần mềm và dịch vụ hàng đầu cho doanh nghiệp của bạn
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            href="/products" 
            className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Xem sản phẩm
          </Link>
          <Link 
            href="/about" 
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Giới thiệu
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Giải pháp của chúng tôi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Phần mềm quản lý</h3>
              <p className="text-gray-600">Hệ thống quản lý doanh nghiệp toàn diện, tích hợp nhiều tính năng hiện đại.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Dịch vụ cloud</h3>
              <p className="text-gray-600">Giải pháp lưu trữ và xử lý dữ liệu trên đám mây an toàn, bảo mật cao.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Tư vấn công nghệ</h3>
              <p className="text-gray-600">Đội ngũ chuyên gia giàu kinh nghiệm, sẵn sàng hỗ trợ mọi vấn đề công nghệ.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 