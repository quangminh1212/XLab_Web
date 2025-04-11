'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { categories, stores } from '@/data/mockData';

export default function StoreProductsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Kiểm tra và lấy thông tin store của người dùng
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // Tìm store của người dùng hiện tại
      const userStore = stores.find(store => store.owner === session.user.email);
      
      if (userStore) {
        setStoreId(userStore.id);
        fetchStoreProducts(userStore.id);
      } else {
        // Chưa có store, có thể chuyển đến trang tạo store
        // router.push('/account/create-store');
      }
    }
  }, [session, status]);
  
  // Lấy danh sách sản phẩm của store
  const fetchStoreProducts = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/stores/${id}/products`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching store products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Xử lý khi gửi form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Tạo form data từ form
    const formData = new FormData(event.target);
    
    // Chuyển FormData thành object
    const formDataObj = {};
    formData.forEach((value, key) => {
      if (key === 'isFeatured' || key === 'isNew') {
        formDataObj[key] = Boolean(value);
      } else if (key === 'price' || key === 'salePrice') {
        formDataObj[key] = value ? Number(value) : 0;
      } else {
        formDataObj[key] = value;
      }
    });
    
    try {
      // Gửi request đến API endpoint
      const response = await fetch(`/api/stores/${storeId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra khi thêm sản phẩm');
      }
      
      const data = await response.json();
      
      // Thêm sản phẩm mới vào danh sách
      setProducts(prevProducts => [...prevProducts, data.product]);
      
      alert('Đã thêm sản phẩm thành công!');
      setShowForm(false);
      event.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi: ' + (error.message || 'Không thể thêm sản phẩm'));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-800 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quản lý sản phẩm</h1>
          <p className="text-xl max-w-3xl">
            Thêm và quản lý sản phẩm trong gian hàng của bạn
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sản phẩm của bạn</h2>
              <button 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                onClick={() => setShowForm(!showForm)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
              </button>
            </div>
            
            {/* Form thêm sản phẩm mới */}
            {showForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm mới</h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="product-name" className="block mb-2 font-medium text-gray-700">
                        Tên sản phẩm <span className="text-red-500">*</span>
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
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
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
                      <label htmlFor="product-description" className="block mb-2 font-medium text-gray-700">
                        Mô tả ngắn <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="product-description"
                        name="description"
                        rows={3}
                        placeholder="Mô tả ngắn gọn về sản phẩm của bạn"
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
                        placeholder="Mô tả chi tiết về tính năng, lợi ích của sản phẩm"
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
                        <option value="personal">Cá nhân</option>
                        <option value="business">Doanh nghiệp</option>
                        <option value="enterprise">Doanh nghiệp lớn</option>
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
                    <button 
                      type="button" 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowForm(false)}
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                      disabled={isLoading}
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
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên của bạn!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
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
                                  e.currentTarget.src = "/images/placeholder-product.jpg"
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
                          <div className="text-sm text-gray-900">
                            {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                          {product.salePrice > 0 && (
                            <div className="text-sm text-gray-500">{formatCurrency(product.salePrice)} (Sale)</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-900">Sửa</button>
                            <button className="text-red-600 hover:text-red-900">Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 