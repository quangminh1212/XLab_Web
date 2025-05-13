'use client'

import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { useState } from 'react'

// Mở rộng kiểu Product để thêm thuộc tính plans
interface AccountProduct extends Product {
  plans?: {
    id: string;
    name: string;
    price: number;
    salePrice: number;
    description: string;
    features: string[];
  }[];
}

export default function AccountsPage() {
  // Tạo danh sách tài khoản mẫu trực tiếp
  const accounts: AccountProduct[] = [
    {
      id: 'chatgpt-premium',
      slug: 'chatgpt-premium',
      name: 'ChatGPT',
      description: 'Tài khoản ChatGPT cao cấp với đầy đủ các tính năng mới nhất.',
      longDescription: 'Tài khoản ChatGPT chính hãng với đầy đủ các tính năng mới nhất từ OpenAI.',
      imageUrl: '/images/products/voice-typing.jpg',
      price: 990000,
      salePrice: 790000,
      categoryId: 'ai',
      rating: 4.9,
      downloadCount: 250,
      viewCount: 600,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1'
    }
  ];

  const [sortOrder, setSortOrder] = useState('newest');

  // Danh mục sản phẩm
  const categories = [
    { id: 'all', name: 'Tất cả', count: accounts.length },
    { id: 'ai', name: 'AI & Chatbot', count: accounts.filter(a => a.categoryId === 'ai').length }
  ];

  return (
    <div className="py-4 bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 max-w-none w-[90%]">
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tài khoản dịch vụ</h1>
          <p className="text-sm md:text-base text-gray-600">
            Danh sách các tài khoản dịch vụ chất lượng cao với mức giá tốt nhất thị trường.
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
                Hiển thị {accounts.length} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-gray-700">Sắp xếp:</label>
                <select 
                  id="sort"
                  className="text-sm border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
              </div>
            </div>
            
            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {accounts.map((account) => (
                <ProductCard 
                  key={account.id}
                  id={account.id.toString()}
                  name={account.name}
                  description={account.description}
                  price={account.salePrice || account.price}
                  originalPrice={account.salePrice && account.salePrice < account.price ? account.price : undefined}
                  image={account.imageUrl || '/placeholder.png'}
                  category={categories.find(c => c.id === account.categoryId)?.name || 'Tài khoản'}
                  rating={account.rating || 0}
                />
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-[15%]">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Danh Mục Sản Phẩm</h3>
              <ul className="space-y-1">
                {categories.map(category => (
                  <li key={category.id}>
                    <a 
                      href={`#${category.id}`}
                      className={`flex justify-between items-center text-sm py-1 px-2 rounded-md hover:bg-gray-50 ${
                        category.id === 'all' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Featured product */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Nổi Bật</h3>
              <div className="space-y-2">
                {accounts.filter(a => a.isFeatured).slice(0, 3).map(account => (
                  <Link 
                    href={`/accounts/${account.id}`}
                    key={account.id}
                    className="flex space-x-2 p-1.5 hover:bg-gray-50 rounded-md"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <img 
                        src={account.imageUrl} 
                        alt={account.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-medium text-gray-900 text-xs">{account.name}</h4>
                      <div className="text-xs text-primary-600 font-medium">
                        {account.salePrice ? formatCurrency(account.salePrice) : formatCurrency(account.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Help box */}
            <div className="bg-primary-50 rounded-lg p-3">
              <h3 className="font-medium text-primary-700 mb-2 text-sm">Cần trợ giúp?</h3>
              <p className="text-xs text-primary-600 mb-2">
                Liên hệ với chúng tôi nếu bạn cần hỗ trợ hoặc tư vấn thêm về các tài khoản dịch vụ.
              </p>
              <a
                href="/contact"
                className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Liên Hệ Ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
} 