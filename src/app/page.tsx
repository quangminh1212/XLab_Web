<<<<<<< HEAD
'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/mockData';

function HomePage() {
  // Lọc sản phẩm nổi bật
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

  // Lọc sản phẩm mới nhất
  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

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
        {/* Featured products */}
        <section className="py-12 bg-white">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              <Link
                href="/products?filter=featured"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm nổi bật</h3>
                  <p className="text-gray-500 max-w-lg mx-auto">
                    Chúng tôi sẽ sớm cập nhật các sản phẩm tốt nhất.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* New products */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
              <Link
                href="/products?filter=new"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            {newProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm mới</h3>
                  <p className="text-gray-500 max-w-lg mx-auto">
                    Hãy quay lại sau để xem các Sản phẩm mới nhất.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 
=======
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
>>>>>>> 2aea817a
