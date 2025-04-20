'use client'

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

export default function ProductDetail({ product }: { product: Product }) {
  // Update document title khi component được render
  useEffect(() => {
    document.title = `${product.name} | XLab - Phần mềm và Dịch vụ`;
  }, [product.name]);

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
                  // Sử dụng Image của Next.js cho các sản phẩm khác
                  <Image
                    src={product.imageUrl || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="max-h-full max-w-full object-contain"
                    unoptimized={true}
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
                  Lượt xem: {product.viewCount || 0}
                </div>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Lượt tải: {product.downloadCount || 0}
                </div>
              </div>
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
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href={`/api/download?slug=${product.slug}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Tải xuống
                </a>
                
                <a 
                  href={`/api/cart/add?id=${product.id}`}
                  className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium inline-flex items-center"
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
        <Link href="/products" className="text-primary-600 hover:underline flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    </div>
  );
} 