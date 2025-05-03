export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gray-900">X</span><span className="text-teal-600">Lab</span>
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Phần mềm và dịch vụ hàng đầu cho doanh nghiệp của bạn
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <a
            href="/products" 
            className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-md transition-all"
          >
            Xem sản phẩm
          </a>
          <a
            href="/about" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-md transition-all"
          >
            Giới thiệu
          </a>
        </div>
      </div>
    </div>
  );
} 