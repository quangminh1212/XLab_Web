'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { categories } from '@/data/mockData';
import { Product } from '@/types';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Simple spinner component
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }[size];
  
  return (
    <svg 
      className={`animate-spin ${sizeClass} text-white`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [logMessages, setLogMessages] = useState<{ message: string; timestamp: string }[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Lấy danh sách sản phẩm từ API khi component được tải
  const fetchProducts = async () => {
    setLoading(true);
    setErrorMessage('');
    setLoadingProducts(true);
    setLastAddedProduct(null);
    
    addLog('Đang tải danh sách sản phẩm từ API...');
    
    try {
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status}`);
      }
      
      const data = await response.json();
      // Sắp xếp sản phẩm theo thời gian tạo mới nhất
      const sortedProducts = data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(sortedProducts);
      setLoadingProducts(false);
      addLog(`Đã tải ${data.length} sản phẩm thành công`);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Lỗi không xác định');
      setLoadingProducts(false);
      addLog(`Lỗi khi tải sản phẩm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Tải danh sách sản phẩm khi component được tải
  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);
  
  // Xử lý khi gửi form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage('');
    
    addLog('Đang xử lý form thêm sản phẩm mới...');
    
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());
      
      // Chuyển đổi giá trị form thành đối tượng sản phẩm
      const productData = {
        name: String(formValues.name || ''),
        slug: String(formValues.slug || ''),
        description: String(formValues.description || ''),
        price: parseFloat(String(formValues.price || '0')),
        categoryId: String(formValues.categoryId || 'cat-1'),
        isFeatured: true, // Mặc định là true để hiển thị trên trang chủ
      };
      
      console.log('Đang gửi dữ liệu sản phẩm:', productData);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể thêm sản phẩm');
      }
      
      const data = await response.json();
      console.log('Sản phẩm đã được thêm thành công:', data);
      
      // Cập nhật danh sách sản phẩm với sản phẩm mới
      setProducts(prevProducts => [data, ...prevProducts]);
      setLastAddedProduct(data);
      setSuccess(true);
      
      // Reset form
      form.reset();
      
      // Tự động đóng thông báo sau 5 giây
      setTimeout(() => {
        setSuccess(false);
        setErrorMessage('');
      }, 5000);
      
      addLog(`Sản phẩm đã được thêm thành công! ID: ${data.id}`);
      
      // Tải lại danh sách sản phẩm để đảm bảo hiển thị đúng
      await fetchProducts();
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Lỗi không xác định');
      addLog(`Lỗi khi thêm sản phẩm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const getCategoryName = (categoryId: string | number) => {
    const category = categories.find(c => c.id === String(categoryId));
    return category ? category.name : String(categoryId);
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev, { message, timestamp }]);
  };

  // Hàm refresh danh sách sản phẩm
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Kết xuất button với spinner
  const renderSubmitButton = () => {
    return (
      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded shadow"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner size="sm" />
            <span className="ml-2">Đang lưu...</span>
          </div>
        ) : (
          'Lưu Sản Phẩm'
        )}
      </Button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý sản phẩm</h1>
      
      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center" role="alert">
          <div className="flex-shrink-0 mr-2">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">{errorMessage}</p>
          </div>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setErrorMessage('')}
          >
            <svg className="h-4 w-4 text-red-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Hiển thị thông báo thành công */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 flex items-center" role="alert">
          <div className="flex-shrink-0 mr-2">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Sản phẩm đã được thêm thành công!</p>
            {lastAddedProduct && (
              <p className="text-sm">
                ID: {lastAddedProduct.id} | Giá: {formatCurrency(lastAddedProduct.price)}
              </p>
            )}
          </div>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setSuccess(false)}
          >
            <svg className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="ten-san-pham"
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập giá sản phẩm"
              />
            </div>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cat-1">Phần mềm doanh nghiệp</option>
                <option value="cat-2">Ứng dụng văn phòng</option>
                <option value="cat-3">Phần mềm đồ họa</option>
                <option value="cat-4">Bảo mật & Antivirus</option>
                <option value="cat-5">Ứng dụng giáo dục</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mô tả sản phẩm"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            {renderSubmitButton()}
          </div>
        </form>
      </div>
      
      {/* Danh sách sản phẩm đã đăng */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sản phẩm đã đăng ({products.length})</h2>
          
          <button 
            onClick={handleRefresh}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center hover:bg-blue-100"
            disabled={loadingProducts}
          >
            {loadingProducts ? (
              <span className="flex items-center">
                <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full mr-1"></div>
                Đang làm mới...
              </span>
            ) : (
              <span className="flex items-center">
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Làm mới danh sách
              </span>
            )}
          </button>
        </div>
        
        {loadingProducts ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Đang tải danh sách sản phẩm...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className={lastAddedProduct && product.id === lastAddedProduct.id ? "bg-green-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{String(product.id).substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(product.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                      {product.salePrice > 0 && (
                        <div className="text-sm text-gray-500">{formatCurrency(product.salePrice)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lastAddedProduct && product.id === lastAddedProduct.id ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Mới thêm
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Đang bán
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-500 mb-1">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500">Sử dụng form bên trên để thêm sản phẩm mới</p>
          </div>
        )}
      </div>
      
      {products.length > 0 && (
        <div className="text-center bg-blue-50 rounded-lg p-4 text-blue-700 mb-8">
          <p className="font-medium mb-2">Đã tìm thấy {products.length} sản phẩm trong hệ thống</p>
          <p className="text-sm">Các sản phẩm đã được lưu vĩnh viễn và sẽ không bị mất khi làm mới trang</p>
        </div>
      )}
      
      <div className="text-center text-gray-500 py-4">
        <p className="mb-2">Lưu ý: Sản phẩm sẽ được lưu vào hệ thống ngay sau khi đăng thành công.</p>
        <p className="mb-2">Nếu bạn muốn xem sản phẩm trên trang chủ, hãy click vào link bên dưới và nhấn "Làm mới dữ liệu".</p>
        <p>
          <a href="/" className="text-blue-500 hover:underline flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ để xem sản phẩm
          </a>
        </p>
      </div>

      {/* Nhật ký hoạt động */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Nhật ký hoạt động</h2>
        <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto">
          {logMessages.length > 0 ? (
            <div className="space-y-2">
              {logMessages.map((log, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-16">Chưa có hoạt động nào được ghi nhận</p>
          )}
        </div>
      </div>
    </div>
  );
} 