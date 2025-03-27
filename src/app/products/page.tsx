'use client'

import { products, categories } from '@/data/mockData'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function ProductsPage() {
  // Get featured products
  const featuredProducts = products.filter(product => product.featured)
  // Get newest products
  const newestProducts = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4)
  
  // Get popular products
  const popularProducts = [...products].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 4)

  // Xử lý lỗi ảnh
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-product.jpg'
  }

  return (
    <div className="pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản phẩm</h1>
            <p className="text-xl text-primary-100">
              Khám phá các sản phẩm phần mềm hiện đại được thiết kế riêng cho doanh nghiệp của bạn.
            </p>
          </div>
        </div>
      </section>
      
      {/* All Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Tất cả sản phẩm</h2>
            <p className="text-gray-600 mt-1">Khám phá toàn bộ sản phẩm của chúng tôi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => {
              // Fallback image nếu không có imageUrl
              const productImage = product.imageUrl || '/placeholder-product.jpg';
              
              return (
                <Link 
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="p-6 bg-gray-50 flex items-center justify-center h-48">
                    <Image
                      src={productImage}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-auto h-auto max-h-32"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-primary-600 font-medium">
                        {product.salePrice 
                          ? Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)
                          : Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {product.downloadCount}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
} 