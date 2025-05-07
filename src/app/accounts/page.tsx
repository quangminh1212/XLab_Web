'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
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
      id: 'capcut-pro',
      slug: 'capcut-pro',
      name: 'CapCut',
      description: 'Tài khoản CapCut với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Nhiều gói thời gian để lựa chọn.',
      longDescription: 'Tài khoản CapCut chính hãng với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
      imageUrl: '/images/products/capcut-logo.png',
      price: 290000,
      salePrice: 199000,
      categoryId: 'accounts',
      rating: 4.8,
      downloadCount: 280,
      viewCount: 500,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1',
      plans: [
        {
          id: 'capcut-pro-7days',
          name: '7 Ngày',
          price: 99000,
          salePrice: 69000,
          description: 'Gói 7 ngày lý tưởng để thử nghiệm hoặc hoàn thành dự án ngắn hạn.',
          features: [
            'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
            'Xuất video không giới hạn',
            'Không có logo watermark',
            'Thư viện hiệu ứng và âm thanh đầy đủ',
            'Có thể sử dụng cho cả thiết bị di động và máy tính',
            'Hỗ trợ kỹ thuật 24/7'
          ]
        },
        {
          id: 'capcut-pro-1month',
          name: '1 Tháng',
          price: 290000,
          salePrice: 199000,
          description: 'Gói 1 tháng phù hợp cho các nhà sáng tạo nội dung thường xuyên.',
          features: [
            'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
            'Xuất video không giới hạn',
            'Không có logo watermark',
            'Thư viện hiệu ứng và âm thanh đầy đủ',
            'Có thể sử dụng cho cả thiết bị di động và máy tính',
            'Hỗ trợ kỹ thuật 24/7',
            'Cập nhật tính năng mới ngay khi phát hành'
          ]
        },
        {
          id: 'capcut-pro-2years',
          name: '2 Năm',
          price: 1990000,
          salePrice: 1290000,
          description: 'Gói 2 năm tiết kiệm tối đa, phù hợp cho các studio và nhà sáng tạo nội dung chuyên nghiệp.',
          features: [
            'Tất cả các hiệu ứng và công cụ chỉnh sửa cao cấp',
            'Xuất video không giới hạn với độ phân giải 4K',
            'Không có logo watermark',
            'Thư viện hiệu ứng và âm thanh đầy đủ và cập nhật thường xuyên',
            'Có thể sử dụng cho cả thiết bị di động và máy tính',
            'Hỗ trợ kỹ thuật ưu tiên 24/7',
            'Cập nhật tính năng mới ngay khi phát hành',
            'Đảm bảo hoàn tiền 30 ngày',
            'Hỗ trợ đồng bộ đám mây không giới hạn',
            'Tiết kiệm hơn 70% so với mua hàng tháng'
          ]
        }
      ]
    },
    {
      id: 'account-1',
      slug: 'chatgpt-premium',
      name: 'ChatGPT',
      description: 'Tài khoản ChatGPT cao cấp với đầy đủ các tính năng mới nhất.',
      longDescription: 'Tài khoản ChatGPT chính hãng với đầy đủ các tính năng mới nhất từ OpenAI.',
      imageUrl: '/images/products/chatgpt-logo.png',
      price: 990000,
      salePrice: 790000,
      categoryId: 'accounts',
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
    },
    {
      id: 'account-3',
      slug: 'adobe-creative-cloud',
      name: 'Adobe Creative Cloud',
      description: 'Truy cập toàn bộ bộ ứng dụng Adobe với tài khoản Creative Cloud tiết kiệm.',
      longDescription: 'Tài khoản Adobe Creative Cloud chính hãng với quyền truy cập toàn bộ bộ ứng dụng Adobe.',
      imageUrl: '/images/products/adobe-logo.png',
      price: 1290000,
      salePrice: 1290000,
      categoryId: 'accounts',
      rating: 4.8,
      downloadCount: 310,
      viewCount: 450,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1'
    },
    {
      id: 'account-4',
      slug: 'canva-pro',
      name: 'Canva Pro',
      description: 'Thiết kế chuyên nghiệp với Canva Pro - công cụ thiết kế đồ họa hàng đầu.',
      longDescription: 'Tài khoản Canva Pro chính hãng cho phép bạn thiết kế chuyên nghiệp với công cụ thiết kế đồ họa hàng đầu.',
      imageUrl: '/images/products/canva-logo.png',
      price: 590000,
      salePrice: 490000,
      categoryId: 'accounts',
      rating: 4.9,
      downloadCount: 420,
      viewCount: 700,
      isAccount: true,
      type: 'account',
      isFeatured: true,
      isNew: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1'
    },
    {
      id: 'account-5',
      slug: 'office-365',
      name: 'Microsoft 365',
      description: 'Truy cập toàn bộ bộ Office và các dịch vụ đám mây của Microsoft.',
      longDescription: 'Tài khoản Microsoft 365 chính hãng với quyền truy cập toàn bộ bộ Office và các dịch vụ đám mây của Microsoft.',
      imageUrl: '/images/products/capcut-logo.png',
      price: 890000,
      salePrice: 690000,
      categoryId: 'office',
      rating: 4.9,
      downloadCount: 380,
      viewCount: 550,
      isAccount: true,
      type: 'account',
      isFeatured: false,
      isNew: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1'
    },
    {
      id: 'account-6',
      slug: 'google-workspace',
      name: 'Google Workspace',
      description: 'Truy cập toàn bộ dịch vụ Google với dung lượng lưu trữ đám mây không giới hạn.',
      longDescription: 'Tài khoản Google Workspace chính hãng với quyền truy cập toàn bộ dịch vụ Google và dung lượng lưu trữ đám mây không giới hạn.',
      imageUrl: '/images/products/chatgpt-logo.png',
      price: 790000,
      salePrice: 590000,
      categoryId: 'office',
      rating: 4.7,
      downloadCount: 290,
      viewCount: 480,
      isAccount: true,
      type: 'account',
      isFeatured: false,
      isNew: false,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1'
    },
    {
      id: 'account-7',
      slug: 'midjourney',
      name: 'Midjourney',
      description: 'Tạo hình ảnh AI với Midjourney - công cụ tạo hình ảnh AI hàng đầu hiện nay.',
      longDescription: 'Tài khoản Midjourney chính hãng cho phép bạn tạo những hình ảnh AI chất lượng cao và sáng tạo.',
      imageUrl: '/images/products/adobe-logo.png',
      price: 990000,
      salePrice: 790000,
      categoryId: 'ai',
      rating: 4.8,
      downloadCount: 340,
      viewCount: 520,
      isAccount: true,
      type: 'account',
      isFeatured: false,
      isNew: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
      version: '1.0',
      size: 'N/A',
      licenseType: 'Premium',
      storeId: '1'
    },
    {
      id: 'account-8',
      slug: 'nordvpn',
      name: 'NordVPN',
      description: 'Bảo vệ quyền riêng tư và truy cập internet an toàn với NordVPN.',
      longDescription: 'Tài khoản NordVPN chính hãng giúp bạn bảo vệ quyền riêng tư và truy cập internet an toàn từ mọi nơi trên thế giới.',
      imageUrl: '/images/products/canva-logo.png',
      price: 590000,
      salePrice: 490000,
      categoryId: 'security',
      rating: 4.7,
      downloadCount: 280,
      viewCount: 460,
      isAccount: true,
      type: 'account',
      isFeatured: false,
      isNew: false,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
    { id: 'ai', name: 'AI & Chatbot', count: accounts.filter(a => a.categoryId === 'ai').length },
    { id: 'design', name: 'Thiết kế & Đồ họa', count: accounts.filter(a => a.categoryId === 'design').length },
    { id: 'office', name: 'Văn phòng', count: accounts.filter(a => a.categoryId === 'office').length },
    { id: 'storage', name: 'Lưu trữ & Backup', count: accounts.filter(a => a.categoryId === 'storage').length },
    { id: 'security', name: 'Bảo mật', count: accounts.filter(a => a.categoryId === 'security').length },
  ];

  return (
    <div className="py-4 bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 max-w-none w-[94%]">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Tài khoản dịch vụ</h1>
          <p className="text-sm md:text-base text-gray-600">
            Danh sách các tài khoản dịch vụ chất lượng cao với mức giá tốt nhất thị trường.
          </p>
        </div>
        
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-4">
            <Link href="/products">
              <div className="py-2 px-2 text-gray-500 hover:text-gray-700 font-medium text-sm md:text-base">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Máy tính
                </div>
              </div>
            </Link>
            <Link href="/accounts">
              <div className="py-2 px-2 border-b-2 border-primary-600 text-primary-600 font-medium text-sm md:text-base">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="text-sm md:text-base text-gray-600">
                Hiển thị {accounts.length} kết quả
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm md:text-base text-gray-700">Sắp xếp:</label>
                <select 
                  id="sort"
                  className="text-sm md:text-base border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                <ProductCard key={account.id} product={account} />
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-[15%]">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">Danh Mục Sản Phẩm</h3>
              <ul className="space-y-1">
                {categories.map(category => (
                  <li key={category.id}>
                    <a 
                      href={`#${category.id}`}
                      className={`flex justify-between items-center text-sm md:text-base py-1 px-2 rounded-md hover:bg-gray-50 ${
                        category.id === 'all' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs md:text-sm px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Featured product */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">Nổi Bật</h3>
              <div className="space-y-2">
                {accounts.slice(0, 3).map(account => (
                  <Link 
                    href={`/accounts/${account.id}`}
                    key={account.id}
                    className="flex space-x-2 p-1.5 hover:bg-gray-50 rounded-md"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      <img 
                        src={account.imageUrl} 
                        alt={account.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-medium text-gray-900 text-sm">{account.name}</h4>
                      <div className="text-xs md:text-sm text-primary-600 font-medium">
                        {account.salePrice ? formatCurrency(account.salePrice) : formatCurrency(account.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Help box */}
            <div className="bg-primary-50 rounded-lg p-3">
              <h3 className="font-medium text-primary-700 mb-2 text-sm md:text-base">Cần trợ giúp?</h3>
              <p className="text-xs md:text-sm text-primary-600 mb-2">
                Liên hệ với chúng tôi nếu bạn cần hỗ trợ hoặc tư vấn thêm về các tài khoản dịch vụ.
              </p>
              <a
                href="/contact"
                className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs md:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
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