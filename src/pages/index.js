export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">
        <span className="text-gray-900">X</span><span className="text-teal-600">Lab</span>
      </h1>
      <p className="mt-3">Phần mềm và dịch vụ hàng đầu cho doanh nghiệp của bạn</p>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <a 
          href="/products"
          className="px-4 py-2 bg-teal-600 text-white rounded"
        >
          Xem sản phẩm
        </a>
        <a 
          href="/about"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
        >
          Giới thiệu
        </a>
      </div>
    </div>
  );
} 