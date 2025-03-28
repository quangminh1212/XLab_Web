'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProductGrid from '@/components/ProductGrid'
import CategoryList from '@/components/CategoryList'
import { categories } from '@/data/mockData'
import { Product } from '@/types'

export default function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Update title khi component được render
  useEffect(() => {
    document.title = 'Sản phẩm | XLab - Phần mềm và Dịch vụ'
    
    // Mô phỏng việc lấy sản phẩm từ API
    const fetchProducts = async () => {
      try {
        // Giả lập gọi API
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Sử dụng mảng rỗng để biểu thị chưa có sản phẩm
        setProducts([])
        setFilteredProducts([])
        setError(null)
      } catch (err: any) {
        console.error('Lỗi khi tải sản phẩm:', err)
        setError(err.message || 'Không thể tải sản phẩm từ máy chủ')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  // Filter products based on search term and category
  useEffect(() => {
    let results = products
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term)
      )
    }
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(product => {
        const category = categories.find(cat => cat.id === product.categoryId)
        return category?.slug === selectedCategory
      })
    }
    
    setFilteredProducts(results)
  }, [searchTerm, selectedCategory, products])

  // Handler for category selection
  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(prevCat => prevCat === slug ? null : slug)
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
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
    )
  }

  // Hiển thị thông báo và hướng dẫn khi không có sản phẩm
  if (products.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa có sản phẩm</h2>
            <p className="text-gray-600 mb-8">
              Hiện tại chưa có sản phẩm nào được thêm vào hệ thống. Bạn có thể thêm sản phẩm mới bằng cách nhấn vào nút bên dưới.
            </p>
            <div className="flex justify-center">
              <Link href="/admin/products/new">
                <Button className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm sản phẩm mới
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Vẫn hiển thị danh mục sản phẩm để người dùng có thể xem các danh mục có sẵn */}
          <div className="mt-16 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Danh mục sản phẩm</h2>
              <Link href="/categories" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Xem tất cả
              </Link>
            </div>
            <CategoryList categories={categories} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
          <Link href="/admin">
            <Button className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm sản phẩm mới
            </Button>
          </Link>
        </div>
        
        {/* Tìm kiếm và lọc */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Reset filters */}
            {(searchTerm || selectedCategory) && (
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(null)
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xóa bộ lọc
              </button>
            )}
          </div>
          
          {/* Danh mục */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Danh mục:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category.slug
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Danh sách sản phẩm đã lọc */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {searchTerm || selectedCategory ? 'Kết quả tìm kiếm' : 'Tất cả sản phẩm'}
            {filteredProducts.length > 0 && <span className="text-gray-500 text-base font-normal ml-2">({filteredProducts.length} sản phẩm)</span>}
          </h2>
          <ProductGrid 
            products={filteredProducts} 
            emptyMessage={
              searchTerm || selectedCategory 
                ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn."
                : "Chưa có sản phẩm nào." 
            }
          />
        </div>
        
        {(!searchTerm && !selectedCategory) && (
          <>
            {/* Danh mục sản phẩm */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Danh mục sản phẩm</h2>
                <Link href="/categories" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Xem tất cả
                </Link>
              </div>
              <CategoryList categories={categories} />
            </div>
          
            {/* Sản phẩm nổi bật */}
            {/* Sản phẩm mới */}
            {/* Sản phẩm phổ biến */}
          </>
        )}
      </div>
    </div>
  )
} 