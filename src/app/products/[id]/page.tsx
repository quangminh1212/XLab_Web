import { products } from '@/data/mockData';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Server Component
export default async function ProductPage({ params }: { params: { id: string } }) {
  // Lấy id từ params và tìm sản phẩm theo slug
  const product = products.find(p => p.slug === params.id);
  
  // Nếu không tìm thấy, sử dụng notFound()
  if (!product) {
    notFound();
  }
  
  // Hiển thị trang sản phẩm
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            {/* Phần hình ảnh */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-64">
                <Image
                  src={product.imageUrl || '/images/placeholder-product.jpg'}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="max-h-full max-w-full object-contain"
                  unoptimized={true}
                />
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <div>Lượt xem: {product.viewCount || 0}</div>
                <div>Lượt tải: {product.downloadCount || 0}</div>
              </div>
            </div>
            
            {/* Phần thông tin */}
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Phiên bản {product.version || '1.0'} | Cập nhật: {new Date(product.updatedAt).toLocaleDateString()}
              </p>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Chi tiết</h2>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-teal-600">
                  {product.price === 0 ? 'Miễn phí' : 
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.price > product.salePrice && (
                  <span className="ml-2 text-gray-500 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href={`/api/download?slug=${product.slug}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Tải xuống
                </a>
                
                <a 
                  href={`/cart/add?id=${product.id}`}
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