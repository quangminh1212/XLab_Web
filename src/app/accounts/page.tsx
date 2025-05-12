'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/common'

// Giả lập dữ liệu tài khoản phần mềm
const accountProducts = [
  {
    id: 'capcut-pro',
    slug: 'capcut-pro',
    name: 'CapCut Pro',
    description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
    imageUrl: '/images/placeholder/placeholder-product.jpg',
    price: 490000,
    salePrice: 349000,
    categoryId: 'editing',
    rating: 4.7
  },
  {
    id: 'canva-pro',
    slug: 'canva-pro',
    name: 'Canva Pro',
    description: 'Thiết kế đồ họa chuyên nghiệp với thư viện phong phú và đầy đủ tính năng.',
    imageUrl: '/images/placeholder/placeholder-product.jpg',
    price: 690000,
    salePrice: 560000,
    categoryId: 'design',
    rating: 4.5
  },
  {
    id: 'microsoft-365',
    slug: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Bộ ứng dụng văn phòng Word, Excel, PowerPoint và nhiều dịch vụ khác.',
    imageUrl: '/images/placeholder/placeholder-product.jpg',
    price: 990000,
    salePrice: 890000,
    categoryId: 'office',
    rating: 4.9
  },
];

// Danh mục tài khoản
const accountCategories = [
  { id: 'all', name: 'Tất cả', count: accountProducts.length },
  { id: 'office', name: 'Ứng dụng văn phòng', count: accountProducts.filter(p => p.categoryId === 'office').length },
  { id: 'design', name: 'Thiết kế đồ họa', count: accountProducts.filter(p => p.categoryId === 'design').length },
  { id: 'editing', name: 'Chỉnh sửa video', count: accountProducts.filter(p => p.categoryId === 'editing').length }
];

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function AccountsPage() {
  const [products, setProducts] = useState(accountProducts);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');

  useEffect(() => {
    document.title = 'Tài Khoản Phần Mềm | XLab - Phần mềm và Dịch vụ'
  }, []);

  // Lọc sản phẩm theo danh mục
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.categoryId === filter;
  });

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-low') {
      return a.salePrice - b.salePrice;
    } else if (sort === 'price-high') {
      return b.salePrice - a.salePrice;
    } else if (sort === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0; // newest mặc định
  });

  return (
    <div className="py-4 bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 max-w-none w-[90%]">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tài Khoản Phần Mềm</h1>
          <p className="text-sm md:text-base text-gray-600">
            Danh sách các tài khoản phần mềm bản quyền với giá cả phải chăng, đầy đủ tính năng và được cập nhật thường xuyên.
          </p>
        </div>
        
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <Link href="/products">
              <div className="py-2 px-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Phần mềm
                </div>
              </div>
            </Link>
            <Link href="/accounts">
              <div className="py-2 px-2 border-b-2 border-primary-600 text-primary-600 font-medium text-sm">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Tài khoản
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Main content */}
          <div className="w-full md:w-[85%]">
            {/* Filters bar */}
            <div className="bg-white p-2 rounded-lg shadow-sm mb-3 flex flex-wrap justify-between items-center">
              <div className="text-sm text-gray-600">
                Hiển thị {sortedProducts.length} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-gray-700">Sắp xếp:</label>
                <select 
                  id="sort"
                  className="text-sm border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-36 bg-gray-100">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-emerald-600 text-sm">{formatCurrency(product.salePrice)}</span>
                        {product.price > product.salePrice && (
                          <span className="text-xs text-gray-500 line-through">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                      <div className="bg-emerald-100 text-emerald-800 text-xs px-1.5 py-0.5 rounded">
                        Có sẵn
                      </div>
                    </div>
                    <Link 
                      href={`/products/${product.slug}`}
                      className="mt-2 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-[15%]">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Danh Mục Tài Khoản</h3>
              <ul className="space-y-1">
                {accountCategories.map(category => (
                  <li key={category.id}>
                    <button 
                      onClick={() => setFilter(category.id)}
                      className={`flex justify-between items-center text-sm py-1 px-2 rounded-md hover:bg-gray-50 w-full text-left ${
                        filter === category.id ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Featured product */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Nổi Bật</h3>
              <div className="space-y-2">
                {products.slice(0, 2).map(product => (
                  <Link 
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="flex space-x-2 p-1.5 hover:bg-gray-50 rounded-md"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-medium text-gray-900 text-xs">{product.name}</h4>
                      <span className="text-xs text-emerald-600 font-medium">{formatCurrency(product.salePrice)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}