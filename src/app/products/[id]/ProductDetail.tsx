'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import { ProductImage } from '@/components/ProductImage';
import { products } from '@/data/mockData';

// Component hiển thị yêu cầu hệ thống
const SystemRequirements = () => (
  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Yêu cầu hệ thống</h3>
    <ul className="text-xs text-gray-600 space-y-1">
      <li>• Windows 10 hoặc mới hơn</li>
      <li>• 2 GB RAM tối thiểu</li>
      <li>• 100 MB dung lượng ổ cứng</li>
      <li>• Kết nối internet</li>
    </ul>
  </div>
);

// Component hiển thị nút chia sẻ
const SocialShareButtons = () => (
  <div className="mt-6 pt-4 border-t border-gray-100">
    <h3 className="text-sm font-medium text-gray-600 mb-2">Chia sẻ sản phẩm này</h3>
    <div className="flex space-x-3">
      <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1.02-1.1h3.2V.5h-4.3c-4.3 0-5.3 3.4-5.3 5.57v1.4H6v4.08h3.12V24h5.38V11.55h3.62l.47-4.08z" />
        </svg>
      </button>
      <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.16a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </button>
      <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.766c-1.566-.43-7.83-.437-7.83-.437s-6.265-.007-7.832.404a2.56 2.56 0 00-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.5 2.5 0 001.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831z" />
          <path fill="#fff" d="M9.996 15.005l5.227-3.005-5.227-3.005v6.01z" />
        </svg>
      </button>
      <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.848 12.459l.741-.741c.161-.161.161-.425 0-.586l-.741-.741c-.161-.161-.425-.161-.586 0l-.741.741-.741-.741c-.161-.161-.425-.161-.586 0l-.741.741c-.161.161-.161.425 0 .586l.741.741-.741.741c-.161.161-.161.425 0 .586l.741.741c.161.161.425.161.586 0l.741-.741.741.741c.161.161.425.161.586 0l.741-.741c.161-.161.161-.425 0-.586l-.741-.741zM7 14.12c-.882 0-1.6.728-1.6 1.6 0 .881.718 1.6 1.6 1.6.881 0 1.6-.719 1.6-1.6 0-.871-.719-1.6-1.6-1.6zm0-8c.881 0 1.6.718 1.6 1.6 0 .881-.719 1.6-1.6 1.6-.882 0-1.6-.719-1.6-1.6 0-.882.718-1.6 1.6-1.6z" />
        </svg>
      </button>
    </div>
  </div>
);

// Component hiển thị sản phẩm liên quan
const RelatedProducts = ({ currentProductId, categoryId }: { currentProductId: string | number, categoryId: string | number }) => {
  // Lọc sản phẩm cùng danh mục nhưng không phải sản phẩm hiện tại
  const relatedProducts = products
    .filter(p => p.categoryId === categoryId && p.id !== currentProductId)
    .slice(0, 3); // Chỉ lấy tối đa 3 sản phẩm

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex items-center justify-center">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                <span className="text-xs font-medium text-primary-600 mt-1 block">
                  {product.price === 0 ? 'Miễn phí' : formatCurrency(product.salePrice || product.price)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function ProductDetail({ product }: { product: Product }) {
  // Update document title khi component được render
  useEffect(() => {
    document.title = `${product.name} | XLab - Phần mềm và Dịch vụ`;
  }, [product.name]);

  // State để theo dõi số lượt xem
  const [viewCount, setViewCount] = useState(product.viewCount || 0);

  // Tăng số lượt xem khi người dùng truy cập trang
  useEffect(() => {
    // Tăng số lượt xem khi component được mount
    setViewCount(prev => prev + 1);
    
    // Trong ứng dụng thực tế, đây là nơi bạn sẽ gọi API để cập nhật số lượt xem
    console.log(`Đang xem sản phẩm: ${product.name}, Lượt xem: ${viewCount + 1}`);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Kiểm tra xem có phải là sản phẩm VoiceTyping hay không
  const isVoiceTyping = product.slug.includes('voice') || product.slug.includes('typing');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            {/* Phần hình ảnh */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <div className={`p-4 rounded-lg flex items-center justify-center h-72 ${isVoiceTyping ? 'bg-gradient-to-br from-blue-50 to-teal-50' : 'bg-gray-100'}`}>
                {isVoiceTyping ? (
                  // Hiển thị hình ảnh đẹp hơn cho VoiceTyping
                  <div className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-lg">
                    <img
                      src="/speech-text.png"
                      alt={product.name}
                      className="w-full h-full object-contain transition-all duration-500 hover:scale-105"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent"></div>
                    {/* Badge ở góc */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-md shadow-sm">
                        Voice Typing Pro
                      </span>
                    </div>
                  </div>
                ) : (
                  // Sử dụng ProductImage cho các sản phẩm khác
                  <ProductImage
                    src={product.imageUrl || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="max-h-full max-w-full"
                    priority={true}
                  />
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Lượt xem: {viewCount}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Lượt tải: {product.downloadCount || 0}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cập nhật: {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Phiên bản: {product.version || '1.0.0'}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  Kích thước: {product.size || 'Chưa xác định'}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Giấy phép: {product.licenseType || 'Standard'}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="mr-1">{product.rating || 4.0}</span>
                  <div className="text-xs text-gray-500">({Math.round(product.downloadCount / 5)} đánh giá)</div>
                </div>
              </div>
              
              {/* Yêu cầu hệ thống */}
              <SystemRequirements />
            </div>
            
            {/* Phần thông tin */}
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Phiên bản {product.version || '1.0.0'} | Cập nhật: {new Date(product.updatedAt).toLocaleDateString('vi-VN')}
              </p>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              {/* Hiển thị danh sách tính năng nếu có */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h2 className="text-lg font-semibold mb-2">Tính năng nổi bật</h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Chi tiết</h2>
                <div className="prose max-w-none">
                  {product.longDescription ? (
                    <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                  ) : (
                    <p>Chưa có thông tin chi tiết về sản phẩm này.</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {product.price === 0 ? 'Miễn phí' : formatCurrency(product.salePrice || product.price)}
                </span>
                {product.salePrice && product.price > product.salePrice && (
                  <span className="ml-2 text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
                {product.salePrice && product.price > product.salePrice && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                    Giảm {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <a 
                  href={`/api/download?slug=${product.slug}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Tải xuống
                </a>
                
                <a 
                  href={`/api/cart/add?id=${product.id}`}
                  className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Thêm vào giỏ hàng
                </a>
              </div>
              
              {/* Nút chia sẻ */}
              <SocialShareButtons />
            </div>
          </div>
        </div>
      </div>
      
      {/* Hiển thị sản phẩm liên quan */}
      <RelatedProducts 
        currentProductId={product.id} 
        categoryId={product.categoryId} 
      />
      
      <div className="mt-6">
        <Link 
          href={product.isAccount || product.type === 'account' ? "/accounts" : "/products"} 
          className="text-primary-600 hover:underline flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách {product.isAccount || product.type === 'account' ? "tài khoản" : "sản phẩm"}
        </Link>
      </div>
    </div>
  );
} 