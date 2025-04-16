'use client';

import React from 'react';
import Link from 'next/link';
import CategoryList from '@/components/CategoryList';
import ProductCard from '@/components/ProductCard';
// Import Product và Category types
import { Product, Category } from '@/types';

// Định nghĩa category Tiện ích theo đúng type
const utilityCategory: Category = {
  id: 'cat-utils', // ID duy nhất cho category
  name: 'Tiện ích',
  slug: 'tien-ich',
  description: 'Các ứng dụng tiện ích cho máy tính.',
  imageUrl: '/images/categories/utilities.png', // Đường dẫn ảnh mẫu
  productCount: 1 // Số lượng sản phẩm (tạm thời)
};

// Định nghĩa dữ liệu tạm thời cho VoiceTyping theo đúng type Product
const voiceTypingProduct: Product = {
  id: 'voicetyping-01',
  name: 'VoiceTyping',
  slug: 'voicetyping', // slug cho URL
  description: 'Nhập văn bản bằng giọng nói tại vị trí con trỏ chuột.',
  longDescription: '<p>VoiceTyping là một ứng dụng máy tính cho phép người dùng nhập văn bản bằng giọng nói tại vị trí con trỏ chuột, sử dụng công nghệ nhận dạng giọng nói của Google Speech Recognition.</p><p>Chi tiết xem tại trang sản phẩm.</p>', // Mô tả dài hơn
  price: 0, // Miễn phí hoặc giá bạn muốn
  salePrice: null, // Sửa undefined thành null để phù hợp với type number | null
  categoryId: utilityCategory.id, // Liên kết với category Tiện ích
  imageUrl: '/images/placeholder-product.jpg', // Sử dụng ảnh placeholder trong public/images
  isFeatured: true,
  isNew: true, // Đánh dấu là sản phẩm mới
  downloadCount: 0,
  viewCount: 0,
  rating: 0, // Chưa có đánh giá
  version: '1.0.0',
  size: '50MB', // Kích thước ước tính
  licenseType: 'Miễn phí', // Hoặc 'Thương mại' nếu bán
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  storeId: '1' // ID cửa hàng mặc định (nếu có)
};

function HomePage() {
  // Sử dụng VoiceTyping làm sản phẩm nổi bật
  const featuredProducts: Product[] = [voiceTypingProduct];

  // Phần sản phẩm mới có thể tạm thời để trống hoặc hiển thị VoiceTyping nếu muốn
  const newProducts: Product[] = [voiceTypingProduct]; // Thêm type Product[] và hiển thị luôn VoiceTyping ở mục mới

  // Danh sách category bao gồm cả Tiện ích
  const categoriesToShow: Category[] = [utilityCategory]; // Thêm type Category[]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full bg-gradient-to-br from-teal-50 via-white to-teal-50 py-10 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900">X</span><span className="text-teal-600">Lab</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8">
              Phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay
            </p>

            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm, ứng dụng..."
                className="w-full px-4 py-3 pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-3 mx-auto max-w-7xl">
        <section className="py-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Danh mục</h2>
            <Link href="/categories" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <CategoryList categories={categoriesToShow} />
        </section>

        {/* Featured products */}
        <section className="py-12 bg-white">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Phần mềm nổi bật</h2>
              <Link
                href="/products/voicetyping"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">Chưa có sản phẩm nổi bật.</p>
              </div>
            )}
          </div>
        </section>

        {/* New products */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Phần mềm mới</h2>
              <Link
                href="/products"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            {newProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có phần mềm mới</h3>
                <p className="text-gray-500 max-w-lg mx-auto">
                  Chúng tôi sẽ sớm cập nhật thêm sản phẩm.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 