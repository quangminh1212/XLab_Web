'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CategoryList from '@/components/CategoryList';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/data/mockData';
import { Product } from '@/types';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/products?t=' + new Date().getTime()); // Thêm timestamp để tránh cache
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu sản phẩm');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Lấy dữ liệu khi component được tải
  useEffect(() => {
    fetchProducts();
  }, []);

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

            <div className="w-full max-w-2xl flex mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm phần mềm, ứng dụng..."
                className="w-full px-4 py-3 pr-12 rounded-l-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              />
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-r-lg">
                Tìm kiếm
              </button>
            </div>
            
            <button 
              onClick={fetchProducts}
              disabled={refreshing}
              className="flex items-center bg-white text-teal-600 border border-teal-300 px-4 py-2 rounded-md shadow-sm hover:bg-teal-50"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-teal-600 border-t-transparent rounded-full mr-2"></div>
                  Đang làm mới...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Làm mới dữ liệu
                </>
              )}
            </button>
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

          <CategoryList categories={categories} />
        </section>

        {/* Featured products */}
        <section className="py-12 bg-white">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Phần mềm nổi bật</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
                <Link
                  href="/products"
                  className="text-teal-600 hover:text-teal-800 transition-colors"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-teal-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm nổi bật</h3>
                <p className="text-gray-500 max-w-lg mx-auto">
                  Hãy thêm sản phẩm tại trang quản trị
                </p>
              </div>
            )}
          </div>
        </section>

        {/* New products */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Phần mềm mới</h2>
              <Link
                href="/products"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                Xem tất cả
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-teal-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : newProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm mới</h3>
                <p className="text-gray-500 max-w-lg mx-auto">
                  Hãy thêm sản phẩm tại trang quản trị
                </p>
              </div>
            )}
          </div>
        </section>
        
        <section className="py-8 text-center">
          <div className="container max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Chưa thấy sản phẩm của bạn?</h2>
              <p className="text-gray-600 mb-4">Nếu bạn vừa đăng sản phẩm nhưng chưa thấy hiển thị, hãy thử làm mới dữ liệu bằng nút phía trên.</p>
              <p className="text-sm text-gray-500">
                Bạn cũng có thể <Link href="/admin" className="text-teal-600 hover:underline">quay lại trang quản lý</Link> để kiểm tra danh sách sản phẩm đã đăng.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage; 