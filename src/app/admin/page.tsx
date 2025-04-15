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
  const [showForm, setShowForm] = useState(true); // Hiển thị form mặc định
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState('');
  const formRef = React.useRef<HTMLFormElement>(null);
  
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
  
  // Xử lý khi chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUploadStatus(`File đã chọn: ${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
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
                {showForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-4">Đăng bán phần mềm mới</h3>
                    
                    {successMessage && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">{successMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {errorMessage && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <form 
                      id="productForm"
                      encType="multipart/form-data"
                      ref={formRef}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="product-name" className="block mb-2 font-medium text-gray-700">
                            Tên phần mềm <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="product-name"
                            name="name"
                            placeholder="Ví dụ: XLab Office Suite"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-slug" className="block mb-2 font-medium text-gray-700">
                            Slug <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="product-slug"
                            name="slug"
                            placeholder="Ví dụ: xlab-office-suite"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-category" className="block mb-2 font-medium text-gray-700">
                            Danh mục <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="product-category"
                            name="categoryId"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          >
                            <option value="">-- Chọn danh mục --</option>
                            <option value="cat-1">Phần mềm doanh nghiệp</option>
                            <option value="cat-2">Ứng dụng văn phòng</option>
                            <option value="cat-3">Phần mềm đồ họa</option>
                            <option value="cat-4">Bảo mật & Antivirus</option>
                            <option value="cat-5">Ứng dụng giáo dục</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="product-price" className="block mb-2 font-medium text-gray-700">
                            Giá (VNĐ) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="product-price"
                            name="price"
                            placeholder="Ví dụ: 1200000"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-sale-price" className="block mb-2 font-medium text-gray-700">
                            Giá khuyến mãi (VNĐ)
                          </label>
                          <input
                            type="number"
                            id="product-sale-price"
                            name="salePrice"
                            placeholder="Để trống nếu không có khuyến mãi"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-version" className="block mb-2 font-medium text-gray-700">
                            Phiên bản <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="product-version"
                            name="version"
                            placeholder="Ví dụ: 1.0.0"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="product-file" className="block mb-2 font-medium text-gray-700">
                            File phần mềm <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="product-file"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              {filePreview ? (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">{file?.name}</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {file ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg
                                    className="w-8 h-8 mb-4 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                  </svg>
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả file
                                  </p>
                                  <p className="text-xs text-gray-500">ZIP, RAR, EXE (MAX. 500MB)</p>
                                </div>
                              )}
                              <input
                                id="product-file"
                                type="file"
                                name="file"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                          </div>
                          {fileUploadStatus && (
                            <div className="mt-2 text-sm text-gray-600">
                              {fileUploadStatus}
                            </div>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="product-description" className="block mb-2 font-medium text-gray-700">
                            Mô tả ngắn <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="product-description"
                            name="description"
                            rows={3}
                            placeholder="Mô tả ngắn gọn về phần mềm của bạn"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          ></textarea>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="product-long-description" className="block mb-2 font-medium text-gray-700">
                            Mô tả chi tiết <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="product-long-description"
                            name="longDescription"
                            rows={6}
                            placeholder="Mô tả chi tiết về tính năng, lợi ích của phần mềm"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          ></textarea>
                        </div>
                        
                        <div>
                          <label htmlFor="product-image-url" className="block mb-2 font-medium text-gray-700">
                            URL hình ảnh <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            id="product-image-url"
                            name="imageUrl"
                            placeholder="https://example.com/image.jpg"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-size" className="block mb-2 font-medium text-gray-700">
                            Dung lượng <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="product-size"
                            name="size"
                            placeholder="Ví dụ: 50MB"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="product-license" className="block mb-2 font-medium text-gray-700">
                            Loại giấy phép <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="product-license"
                            name="licenseType"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                          >
                            <option value="">-- Chọn loại giấy phép --</option>
                            <option value="Cá nhân">Cá nhân</option>
                            <option value="Doanh nghiệp">Doanh nghiệp</option>
                            <option value="Doanh nghiệp lớn">Doanh nghiệp lớn</option>
                            <option value="Thương mại">Thương mại</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center">
                          <input type="checkbox" id="product-featured" name="isFeatured" className="mr-2" />
                          <label htmlFor="product-featured" className="text-gray-700">
                            Đánh dấu là sản phẩm nổi bật
                          </label>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center">
                          <input type="checkbox" id="product-new" name="isNew" className="mr-2" />
                          <label htmlFor="product-new" className="text-gray-700">
                            Đánh dấu là sản phẩm mới
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-4">
                        {/* Button chính */}
                        <button 
                          type="button" 
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                          disabled={isLoading}
                          onClick={async () => {
                            console.log('Submit button clicked');
                            try {
                              // Lấy form
                              const form = formRef.current;
                              if (!form) {
                                console.error('Form reference not found');
                                return;
                              }
                              
                              // Kiểm tra tính hợp lệ của form
                              const isValid = Array.from(form.elements).every((element: any) => {
                                if (element.hasAttribute('required') && !element.value && element.type !== 'checkbox' && element.type !== 'file') {
                                  alert(`Vui lòng điền trường ${element.name}`);
                                  element.focus();
                                  return false;
                                }
                                return true;
                              });
                              
                              if (!isValid) {
                                return;
                              }
                              
                              setIsLoading(true);
                              setErrorMessage('');
                              setSuccessMessage('');
                              setFileUploadStatus('Đang tải lên...');
                              
                              // Tạo FormData
                              const formData = new FormData(form);
                              
                              // Xử lý các checkbox
                              const featuredCheckbox = form.querySelector('#product-featured') as HTMLInputElement;
                              const newCheckbox = form.querySelector('#product-new') as HTMLInputElement;
                              
                              if (featuredCheckbox) {
                                formData.set('isFeatured', featuredCheckbox.checked ? 'on' : 'off');
                                console.log('isFeatured:', featuredCheckbox.checked ? 'on' : 'off');
                              }
                              
                              if (newCheckbox) {
                                formData.set('isNew', newCheckbox.checked ? 'on' : 'off');
                                console.log('isNew:', newCheckbox.checked ? 'on' : 'off');
                              }
                              
                              // Thêm file nếu có
                              if (file) {
                                formData.append('file', file);
                                console.log('File added:', file.name);
                              }
                              
                              // In ra tất cả các giá trị trong FormData để debug
                              console.log('Form data being submitted:');
                              formData.forEach((value, key) => {
                                console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
                              });
                              
                              // Gửi request
                              const response = await fetch('/api/products', {
                                method: 'POST',
                                body: formData
                              });
                              
                              if (!response.ok) {
                                throw new Error(`Lỗi: ${response.status}`);
                              }
                              
                              const result = await response.json();
                              
                              if (result.success) {
                                setSuccessMessage('Sản phẩm đã được tạo thành công!');
                                if (result.data && result.data.fileUrl) {
                                  setFileUploadStatus(`File đã tải lên thành công: ${result.data.fileName}`);
                                } else {
                                  setFileUploadStatus('Tạo sản phẩm thành công nhưng không có file đính kèm');
                                }
                                form.reset();
                                setFile(null);
                                setFilePreview('');
                                loadProducts();
                              } else {
                                setErrorMessage(result.message || 'Có lỗi xảy ra');
                                setFileUploadStatus('Tải lên thất bại');
                              }
                            } catch (error) {
                              console.error('Error:', error);
                              setErrorMessage(error instanceof Error ? error.message : 'Đã xảy ra lỗi');
                              setFileUploadStatus('Tải lên thất bại: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          {isLoading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          Đăng sản phẩm
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
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