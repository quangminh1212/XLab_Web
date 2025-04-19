import { products } from '@/data/mockData';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Cấu hình hiển thị tức thì
export const dynamic = "force-static";

export default function ProductPage({ params }: { params: { id: string } }) {
  // Hiển thị sản phẩm cơ bản
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            {/* Phần hình ảnh */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-64">
                <Image
                  src={'/images/placeholder-product.jpg'}
                  alt={"Tên sản phẩm"}
                  width={300}
                  height={300}
                  className="max-h-full max-w-full object-contain"
                  unoptimized={true}
                />
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <div>Lượt xem: 100</div>
                <div>Lượt tải: 50</div>
              </div>
            </div>
            
            {/* Phần thông tin */}
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">VoiceTyping Pro</h1>
              <p className="text-sm text-gray-500 mb-4">
                Phiên bản 1.0.0 | Cập nhật: {new Date().toLocaleDateString()}
              </p>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
                <p className="text-gray-700">Nhập văn bản bằng giọng nói tại vị trí con trỏ chuột sử dụng Google Speech Recognition</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Chi tiết</h2>
                <div className="prose max-w-none">
                  <p>VoiceTyping là một ứng dụng máy tính cho phép người dùng nhập văn bản bằng giọng nói tại vị trí con trỏ chuột, sử dụng công nghệ nhận dạng giọng nói của Google Speech Recognition.</p>
                  <ul>
                    <li>Frontend: Giao diện người dùng (GUI) xây dựng bằng PyQt5</li>
                    <li>Backend: Mô-đun nhận dạng giọng nói, xử lý văn bản, điều khiển con trỏ</li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-teal-600">
                  Miễn phí
                </span>
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href="/api/download?slug=voicetyping"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Tải xuống
                </a>
                
                <a 
                  href="/cart/add?id=prod-vt"
                  className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 rounded-lg font-medium inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Thêm vào giỏ hàng
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <a href="/products" className="text-teal-600 hover:underline flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách sản phẩm
        </a>
      </div>
    </div>
  );
} 