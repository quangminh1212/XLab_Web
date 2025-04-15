'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import React from 'react';

// Đã xóa export metadata vì không thể sử dụng trong client component

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('Sản phẩm mẫu');
  const [slug, setSlug] = useState('san-pham-mau');
  const [description, setDescription] = useState('Đây là sản phẩm mẫu');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // Tải danh sách sản phẩm
  const loadProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      console.log('Loading products from API...');
      
      // Sử dụng timestamp để tránh cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/products?_=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Loaded products:', data);
      
      if (data.success && Array.isArray(data.data)) {
        console.log(`Received ${data.data.length} products from API`);
        setProducts(data.data);
      } else {
        console.error('Invalid API response format:', data);
        setErrorMessage('Không thể lấy dữ liệu sản phẩm - Định dạng phản hồi không hợp lệ');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setErrorMessage('Đã xảy ra lỗi khi tải danh sách sản phẩm');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);
  
  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Xử lý khi submit form
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      const productData = {
        name,
        slug,
        description,
        longDescription: description,
        imageUrl: 'https://via.placeholder.com/150',
        price: 100000,
        categoryId: 'cat-1',
        version: '1.0.0',
        size: '10MB',
        licenseType: 'Cá nhân',
        isFeatured: true,
        isNew: true
      };
      
      // Hiển thị dữ liệu sẽ gửi
      console.log('Sending data:', productData);
      
      // Gửi POST request
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setSuccessMessage('Đăng sản phẩm thành công!');
        loadProducts();
      } else {
        setErrorMessage(data.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage('Lỗi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-800 text-white py-10">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Đăng bán sản phẩm mới</h1>
          <p className="text-xl max-w-3xl">
            Đăng ký sản phẩm của bạn trên nền tảng XLab
          </p>
        </div>
      </section>

      {/* Admin Dashboard */}
      <section className="py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="w-full">
              {/* Products Management */}
              <div id="products" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Đăng sản phẩm mới</h2>
                </div>
                
                {/* Form thêm sản phẩm mới */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Form đơn giản nhất có thể</h3>
                  
                  {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                      <p className="text-green-700">{successMessage}</p>
                    </div>
                  )}
                  
                  {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <p className="text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block mb-2">Tên sản phẩm</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2">Slug</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2">Mô tả</label>
                    <textarea 
                      className="w-full p-2 border" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full p-2 bg-blue-500 text-white"
                    disabled={isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đăng sản phẩm đơn giản'}
                  </button>
                </div>
                
                {/* Danh sách sản phẩm */}
                <div className="overflow-x-auto">
                  <h3 className="text-xl font-semibold mb-4">Sản phẩm đã đăng ({products.length})</h3>
                  {products.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản phẩm
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh mục
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  <Image
                                    src={product.imageUrl || "/images/placeholder-product.jpg"}
                                    alt={product.name}
                                    fill
                                    className="rounded-md"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder-product.jpg'
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.categoryId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                              {product.salePrice > 0 && (
                                <div className="text-sm text-gray-500">{formatCurrency(product.salePrice)} (Sale)</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Đang bán
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center p-10 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Chưa có sản phẩm nào được đăng</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 