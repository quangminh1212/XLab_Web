'use client'

import { products as mockProducts, categories } from '@/data/mockData'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  // Lấy dữ liệu sản phẩm trực tiếp từ mockData
  const products = mockProducts || [];
  
  // Phân loại sản phẩm
  const featuredProducts = products.filter(product => product.isFeatured);
  const newProducts = products.slice().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);
  const popularProducts = products.slice().sort((a, b) => 
    (b.downloadCount || 0) - (a.downloadCount || 0)
  ).slice(0, 6);

  // Log thông tin để debug
  console.log('Products count:', products.length);
  console.log('Featured products:', featuredProducts.length);

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sản phẩm phần mềm</h1>
          <p className="text-gray-600">
            Khám phá các giải pháp phần mềm chất lượng cao được phát triển bởi XLab và cộng đồng.
          </p>
        </div>

        {(!products || products.length === 0) ? (
          <div className="py-12 text-center">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa có sản phẩm</h2>
              <p className="text-gray-600 mb-6">
                Hiện tại chúng tôi chưa có sản phẩm nào. Các sản phẩm sẽ được thêm vào sau.
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm nổi bật</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
            
            {newProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm mới</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
            
            {popularProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Phổ biến nhất</h2>
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