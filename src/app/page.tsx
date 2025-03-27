'use client';

import React from 'react';
import Link from 'next/link';
import CategoryList from '@/components/CategoryList';
import ProductCard from '@/components/ProductCard';
import { categories, products } from '@/data/mockData';

function HomePage() {
  // Lọc sản phẩm nổi bật
  const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);
  
  // Lọc sản phẩm mới nhất
  const newProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-10 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900">X</span><span className="text-primary-600">Lab</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8">
              Phần mềm riêng của bạn - Tải về và sử dụng ngay hôm nay
            </p>
            
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm, ứng dụng..."
                className="w-full px-4 py-3 pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors">
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
            <Link href="/categories" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          
          <CategoryList categories={categories} />
        </section>

        <section className="py-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Phần mềm nổi bật</h2>
            <Link href="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="py-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Phần mềm mới</h2>
            <Link href="/products?sort=newest" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 