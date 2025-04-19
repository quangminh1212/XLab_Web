'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';

// Đặt là trang tĩnh để tránh lỗi params
export const dynamic = 'error';
export const dynamicParams = true;

export default function ProductPage({ params }: { params: { id: string } }) {
  // Tìm sản phẩm trực tiếp từ mockData
  const productId = params.id;
  const product = products.find(p => p.slug === productId || p.id === productId);
  
  // Log thông tin để debug
  console.log('Product ID:', productId);
  console.log('Product found:', product?.name || 'Not found');

  // Nếu không tìm thấy sản phẩm, hiển thị thông báo lỗi
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy sản phẩm</h1>
          <p className="mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
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
  
  // Hiển thị thông tin sản phẩm
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
                  priority={true}
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