import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { getProductBySlug, incrementViewCount, formatCurrency } from '@/lib/utils'
import { products } from '@/data/mockData'
import { DownloadButton } from './client'

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = getProductBySlug(params.id);
  return {
    title: `${product?.name || 'Sản phẩm'} | XLab - Phần mềm và Dịch vụ`,
    description: product?.description || 'Chi tiết sản phẩm phần mềm từ XLab',
  };
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  
  // Tăng lượt xem khi render trang (chỉ tính server-side)
  const viewCount = product ? incrementViewCount(product.slug) : 0;
  
  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Sản phẩm không tồn tại</h1>
        <p className="mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link href="/products" className="btn bg-primary-600 text-white">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div>
      {/* Product Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl max-w-3xl">{product.description}</p>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center p-6">
                <Image
                  src={product.imageUrl || '/images/product-placeholder.svg'}
                  alt={product.name}
                  width={240}
                  height={240}
                  className="max-w-full max-h-[320px] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product-placeholder.svg';
                  }}
                />
              </div>
              
              {/* Thống kê sản phẩm */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Lượt xem:</span>
                  </div>
                  <span className="text-sm font-bold text-primary-600">{viewCount.toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Lượt tải:</span>
                  </div>
                  <span className="text-sm font-bold text-primary-600">{product.downloadCount.toLocaleString('vi-VN')}</span>
                </div>
              </div>
              
              {/* Product Demo/Screenshots */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Demo và hình ảnh</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((index) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <div className="h-20 flex items-center justify-center text-gray-400">
                        Screenshot {index}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button className="btn bg-secondary-600 text-white">Xem Demo Trực tuyến</button>
                </div>
              </div>
            </div>

            {/* Product Info & Purchase */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-3xl font-bold text-primary-600">
                      {formatCurrency(product.salePrice || product.price)}
                    </p>
                    {product.salePrice && (
                      <p className="text-gray-500 line-through">
                        {formatCurrency(product.price)}
                      </p>
                    )}
                  </div>
                  <div className="flex">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-gray-600">({Math.round(viewCount/20)} đánh giá)</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="text-green-500 mt-1 mr-3">✓</div>
                    <p>Bản quyền trọn đời, cập nhật miễn phí trong 1 năm</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mt-1 mr-3">✓</div>
                    <p>Hỗ trợ kỹ thuật 24/7</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mt-1 mr-3">✓</div>
                    <p>Cài đặt không giới hạn thiết bị cho 1 người dùng</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="btn bg-primary-600 text-white w-full">Thêm vào giỏ hàng</button>
                  <button className="btn bg-secondary-600 text-white w-full">Mua ngay</button>
                  <DownloadButton slug={product.slug}>
                    Tải xuống dùng thử
                  </DownloadButton>
                </div>
              </div>

              {/* System Requirements */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Thông tin phần mềm</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="font-semibold w-1/3">Phiên bản:</span>
                    <span>{product.version}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Dung lượng:</span>
                    <span>{product.size}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Giấy phép:</span>
                    <span>{product.license}</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Nhà phát hành:</span>
                    <span>XLab Software</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold w-1/3">Cập nhật:</span>
                    <span>{new Date(product.updatedAt).toLocaleDateString('vi-VN')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Giới thiệu về {product.name}</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md mx-auto max-w-4xl">
            <div className="prose max-w-none">
              {product.longDescription && (
                <div className="whitespace-pre-line">
                  {product.longDescription}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 