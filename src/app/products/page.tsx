'use client'

import { products as mockProducts, categories } from '@/data/mockData'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ProductImage } from '@/components/ProductImage'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>(mockProducts || []);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Update title when component is rendered
  useEffect(() => {
    document.title = 'Phần mềm | XLab - Phần mềm và Dịch vụ'
  }, []);
  
  // Lọc sản phẩm theo loại: chỉ lấy phần mềm
  const softwareProducts = products.filter(product => 
    !product.isAccount && (product.type === 'software' || !product.type)
  );
  
  // Lọc theo danh mục và tìm kiếm
  const filteredProducts = softwareProducts.filter(product => {
    // Lọc theo danh mục
    if (filter !== 'all' && product.categoryId !== filter) {
      return false;
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      );
    }
    
    return true;
  });
  
  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sort === 'price-low') {
      return (a.salePrice || a.price) - (b.salePrice || b.price);
    } else if (sort === 'price-high') {
      return (b.salePrice || b.price) - (a.salePrice || a.price);
    } else if (sort === 'popular') {
      return (b.downloadCount || 0) - (a.downloadCount || 0);
    } else if (sort === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });
  
  // Lọc các loại sản phẩm đặc biệt cho phần mềm
  const featuredProducts = softwareProducts.filter(product => product.isFeatured);
  const newProducts = softwareProducts.slice().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);
  const popularProducts = softwareProducts.slice().sort((a, b) => 
    (b.downloadCount || 0) - (a.downloadCount || 0)
  ).slice(0, 6);

  // Only show loading for a maximum of 1 second
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không thể tải sản phẩm</h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Thử lại
            </button>
            <Link 
              href="/"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
              </svg>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Phần mềm của XLab</h1>
          <p className="text-gray-600">
            Khám phá các giải pháp phần mềm và ứng dụng chất lượng cao do XLab cung cấp.
          </p>
        </div>
        
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-4">
            <Link href="/products">
              <div className="py-4 px-2 border-b-2 border-primary-600 text-primary-600 font-medium">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Phần mềm
                </div>
              </div>
            </Link>
            <Link href="/accounts">
              <div className="py-4 px-2 text-gray-500 hover:text-gray-700 font-medium">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tài khoản
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Hiển thị tiêu đề */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Phần mềm
          </h2>
          <p className="text-gray-600 mt-2">
            Các ứng dụng và phần mềm máy tính do XLab phát triển và phân phối.
          </p>
        </div>

        {(!softwareProducts || softwareProducts.length === 0) ? (
          <div className="py-12 text-center">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Chưa có phần mềm nào
              </h2>
              <p className="text-gray-600 mb-6">
                Hiện tại chúng tôi chưa có phần mềm nào. Các sản phẩm sẽ được thêm vào sau.
              </p>
              <Link 
                href="/"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Bộ lọc và tìm kiếm */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-grow">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      placeholder="Tìm kiếm phần mềm..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    id="category"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
                  <select
                    id="sort"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Kết quả tìm kiếm */}
            {searchTerm || filter !== 'all' ? (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Kết quả lọc ({sortedProducts.length} sản phẩm)
                  </h2>
                  {(searchTerm || filter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
                
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                    <p className="text-gray-500 max-w-lg mx-auto">
                      Không có sản phẩm nào phù hợp với bộ lọc của bạn. Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
                    </p>
                  </div>
                )}
              </section>
            ) : (
              <>
                {featuredProducts.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Phần mềm nổi bật
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )}
                
                {newProducts.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Phần mềm mới
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {newProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )}
                
                {popularProducts.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Phần mềm phổ biến nhất
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {popularProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 