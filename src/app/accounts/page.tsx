'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

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
      name: 'CapCut Pro',
      description: 'Tài khoản CapCut Pro với đầy đủ tính năng chỉnh sửa video chuyên nghiệp. Nhiều gói thời gian để lựa chọn.',
      longDescription: 'Tài khoản CapCut Pro chính hãng với đầy đủ tính năng chỉnh sửa video chuyên nghiệp.',
      imageUrl: '/images/products/photo-editor.png',
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
      name: 'ChatGPT Premium',
      description: 'Tài khoản ChatGPT Plus cao cấp với đầy đủ các tính năng mới nhất.',
      longDescription: 'Tài khoản ChatGPT Premium chính hãng với đầy đủ các tính năng mới nhất từ OpenAI.',
      imageUrl: '/images/products/code-editor.png',
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
      imageUrl: '/images/products/design-master.png',
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
      imageUrl: '/images/products/design-master.png',
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
    }
  ];
  
  // Lọc riêng từng loại tài khoản
  const capcutAccounts = accounts.filter(account => account.slug === 'capcut-pro');
  const chatgptAccounts = accounts.filter(account => account.slug === 'chatgpt-premium');
  const otherAccounts = accounts.filter(account => 
    account.slug !== 'capcut-pro' && account.slug !== 'chatgpt-premium'
  );

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tài khoản dịch vụ</h1>
          <p className="text-gray-600">
            Danh sách các tài khoản dịch vụ chất lượng cao với mức giá tốt nhất thị trường.
          </p>
        </div>
        
        {/* Tabs điều hướng */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-4">
            <Link href="/products">
              <div className="py-4 px-2 text-gray-500 hover:text-gray-700 font-medium">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Máy tính
                </div>
              </div>
            </Link>
            <Link href="/accounts">
              <div className="py-4 px-2 border-b-2 border-primary-600 text-primary-600 font-medium">
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
        
        <div className="space-y-12">
          {/* Mục riêng cho CapCut Pro */}
          {capcutAccounts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">CapCut Pro</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {capcutAccounts.map((account) => (
                  <ProductCard key={account.id} product={account} />
                ))}
              </div>
            </section>
          )}
          
          {/* Mục riêng cho ChatGPT Premium */}
          {chatgptAccounts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ChatGPT Premium</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {chatgptAccounts.map((account) => (
                  <ProductCard key={account.id} product={account} />
                ))}
              </div>
            </section>
          )}
          
          {/* Các tài khoản khác */}
          {otherAccounts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tài khoản khác</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherAccounts.map((account) => (
                  <ProductCard key={account.id} product={account} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 