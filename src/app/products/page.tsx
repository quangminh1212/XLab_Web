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
  const [activeTab, setActiveTab] = useState('software'); // 'software' hoặc 'accounts'
  
  // Update title when component is rendered
  useEffect(() => {
    document.title = 'Sản phẩm | XLab - Phần mềm và Dịch vụ'
    
    console.log('mockProducts length:', mockProducts?.length || 0);
    
    // Không cần loading state nếu sử dụng mock data trực tiếp
    setProducts(mockProducts || []);
    
    if (!mockProducts || mockProducts.length === 0) {
      console.log('Không có sản phẩm');
    } else {
      console.log('Đã tải ' + mockProducts.length + ' sản phẩm');
    }
    
    // Kiểm tra query parameter để chuyển tab
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'accounts') {
      setActiveTab('accounts');
    }
  }, []);
  
  // Lọc sản phẩm theo loại
  const softwareProducts = products.filter(product => 
    !product.isAccount && (product.type === 'software' || !product.type)
  );
  
  const accountProducts = products.filter(product => 
    product.isAccount || product.type === 'account'
  );
  
  // Lọc sản phẩm theo danh mục và loại đã chọn
  const currentProducts = activeTab === 'software' ? softwareProducts : accountProducts;
  
  // Lọc các loại sản phẩm đặc biệt cho danh mục hiện tại
  const featuredProducts = currentProducts.filter(product => product.isFeatured);
  const newProducts = currentProducts.slice().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);
  const popularProducts = currentProducts.slice().sort((a, b) => 
    (b.downloadCount || 0) - (a.downloadCount || 0)
  ).slice(0, 6);

  console.log('Loading state:', loading);
  console.log('Products count:', products.length);
  console.log('Featured products:', featuredProducts.length);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm của XLab</h1>
          <p className="text-gray-600">
            Khám phá các giải pháp phần mềm và tài khoản chất lượng cao do XLab cung cấp.
          </p>
        </div>
        
        {/* Tabs để chuyển đổi giữa phần mềm và tài khoản */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('software')}
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'software'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Phần mềm
            </div>
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'accounts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Tài khoản
            </div>
          </button>
        </div>

        {/* Hiển thị tiêu đề theo tab đang active */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'software' ? 'Phần mềm' : 'Tài khoản phụ trợ'}
          </h2>
          <p className="text-gray-600 mt-2">
            {activeTab === 'software' 
              ? 'Các ứng dụng và phần mềm do XLab phát triển và phân phối.' 
              : 'Tài khoản ChatGPT, CapCut và các dịch vụ khác với giá tốt nhất.'}
          </p>
        </div>

        {(!currentProducts || currentProducts.length === 0) ? (
          <div className="py-12 text-center">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === 'software' 
                  ? 'Chưa có phần mềm nào' 
                  : 'Chưa có tài khoản phụ trợ nào'}
              </h2>
              <p className="text-gray-600 mb-6">
                {activeTab === 'software'
                  ? 'Hiện tại chúng tôi chưa có phần mềm nào. Các sản phẩm sẽ được thêm vào sau.'
                  : 'Hiện tại chúng tôi chưa có tài khoản phụ trợ nào. Vui lòng quay lại sau.'}
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
            {featuredProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {activeTab === 'software' ? 'Phần mềm nổi bật' : 'Tài khoản đề xuất'}
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
                  {activeTab === 'software' ? 'Phần mềm mới' : 'Tài khoản mới'}
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
                  {activeTab === 'software' ? 'Phần mềm phổ biến nhất' : 'Tài khoản bán chạy'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
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