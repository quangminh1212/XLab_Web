'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { products as mockProducts } from '@/data/mockData'
import ProductCard from '@/components/ProductCard'

export default function AccountsPage() {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Update title when component is rendered
  useEffect(() => {
    document.title = 'Tài khoản | XLab - Phần mềm và Dịch vụ'
    
    // Lọc ra các tài khoản từ dữ liệu mẫu
    const accountProducts = mockProducts.filter(product => 
      product.isAccount || product.type === 'account'
    );
    
    // Tạo tài khoản mẫu
    const sampleAccounts = [
      {
        id: 'account-1',
        slug: 'chatgpt-premium',
        name: 'ChatGPT Premium',
        description: 'Tài khoản ChatGPT Plus cao cấp với đầy đủ các tính năng mới nhất.',
        imageUrl: '/images/products/code-editor.png',
        price: 990000,
        salePrice: 790000,
        rating: 4.9,
        downloadCount: 250,
        isAccount: true,
        type: 'account',
        isFeatured: true,
        isNew: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0'
      },
      {
        id: 'account-2',
        slug: 'capcut-pro',
        name: 'CapCut Pro',
        description: 'Tài khoản Pro cho phần mềm chỉnh sửa video CapCut với các tính năng chuyên nghiệp.',
        imageUrl: '/images/products/photo-editor.png',
        price: 590000,
        salePrice: 450000,
        rating: 4.7,
        downloadCount: 180,
        isAccount: true,
        type: 'account',
        isFeatured: true,
        isNew: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        version: '1.0'
      },
      {
        id: 'account-3',
        slug: 'adobe-creative-cloud',
        name: 'Adobe Creative Cloud',
        description: 'Truy cập toàn bộ bộ ứng dụng Adobe với tài khoản Creative Cloud tiết kiệm.',
        imageUrl: '/images/products/design-master.png',
        price: 1290000,
        salePrice: null,
        rating: 4.8,
        downloadCount: 310,
        isAccount: true,
        type: 'account',
        isFeatured: true,
        isNew: false,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        version: '1.0'
      },
      {
        id: 'account-4',
        slug: 'canva-pro',
        name: 'Canva Pro',
        description: 'Thiết kế chuyên nghiệp với Canva Pro - công cụ thiết kế đồ họa hàng đầu.',
        imageUrl: '/images/products/design-master.png',
        price: 590000,
        salePrice: 490000,
        rating: 4.9,
        downloadCount: 420,
        isAccount: true,
        type: 'account',
        isFeatured: true,
        isNew: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        version: '1.0'
      },
      {
        id: 'account-5',
        slug: 'microsoft-365',
        name: 'Microsoft 365',
        description: 'Truy cập đầy đủ bộ ứng dụng Microsoft Office với tài khoản 365 chính hãng.',
        imageUrl: '/images/products/business-suite.png',
        price: 890000,
        salePrice: 790000,
        rating: 4.7,
        downloadCount: 350,
        isAccount: true,
        type: 'account',
        isFeatured: false,
        isNew: false,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        version: '1.0'
      }
    ];
    
    // Nếu không có tài khoản trong dữ liệu mẫu, sử dụng tài khoản mẫu
    if (accountProducts.length === 0) {
      setAccounts(sampleAccounts);
    } else {
      setAccounts(accountProducts);
    }
  }, []);
  
  // Lọc các loại tài khoản đặc biệt
  const featuredAccounts = accounts.filter(account => account.isFeatured);
  const newAccounts = accounts.slice().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);
  const popularAccounts = accounts.slice().sort((a, b) => 
    (b.downloadCount || 0) - (a.downloadCount || 0)
  ).slice(0, 6);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu tài khoản...</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không thể tải danh sách tài khoản</h2>
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
        
        {accounts.length === 0 ? (
          <div className="py-12 text-center">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa có tài khoản nào</h2>
              <p className="text-gray-600 mb-6">
                Hiện tại chúng tôi chưa có tài khoản nào. Vui lòng quay lại sau.
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
            {featuredAccounts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tài khoản nổi bật</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredAccounts.map((account) => (
                    <ProductCard key={account.id} product={account} />
                  ))}
                </div>
              </section>
            )}
            
            {newAccounts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tài khoản mới</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newAccounts.map((account) => (
                    <ProductCard key={account.id} product={account} />
                  ))}
                </div>
              </section>
            )}
            
            {popularAccounts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tài khoản bán chạy</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularAccounts.map((account) => (
                    <ProductCard key={account.id} product={account} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 