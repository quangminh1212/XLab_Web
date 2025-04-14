'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/mockData';

export const metadata = {
  title: 'Quản trị | XLab - Phần mềm và Dịch vụ',
  description: 'Trang quản trị XLab - Chỉ dành cho quản trị viên',
}

// Định nghĩa kiểu cho products
interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  // Các thuộc tính khác nếu cần
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Kiểm tra quyền admin
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.email !== 'xlab.rnd@gmail.com') {
        router.push('/');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    // Load danh sách sản phẩm từ dữ liệu mẫu
    setProducts(products);
  }, []);

  // Xử lý khi gửi form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Tạo form data từ form
    const formData = new FormData(event.currentTarget);
    
    // Tại đây sẽ gửi API request để thêm sản phẩm
    // Mô phỏng thêm sản phẩm thành công
    setTimeout(() => {
      alert('Đã thêm sản phẩm thành công!');
      setIsLoading(false);
      setShowForm(false);
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
    }, 1000);
  }
  
  if (status === 'loading' || (status === 'authenticated' && session?.user?.email !== 'xlab.rnd@gmail.com')) {
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
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quản trị hệ thống</h1>
          <p className="text-xl max-w-3xl">
            Quản lý sản phẩm, danh mục và nội dung trên XLab
          </p>
        </div>
      </section>

      {/* Admin Dashboard */}
      <section className="py-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-4">
                    <Image
                      src={session?.user?.image || '/images/avatar-placeholder.svg'}
                      alt={session?.user?.name || 'Admin'}
                      fill
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/images/avatar-placeholder.svg'
                      }}
                    />
                  </div>
                  <h2 className="text-xl font-bold">{session?.user?.name || 'Admin'}</h2>
                  <p className="text-gray-600">{session?.user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Quản trị viên</p>
                </div>
                
                <nav className="space-y-1">
                  <a href="#dashboard" className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    Tổng quan
                  </a>
                  <a href="#products" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Quản lý sản phẩm
                  </a>
                  <a href="#categories" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Quản lý danh mục
                  </a>
                  <a href="#orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Quản lý đơn hàng
                  </a>
                  <a href="#users" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Quản lý người dùng
                  </a>
                  <a href="#settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt hệ thống
                  </a>
                  <Link href="/" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Về trang chủ
                  </Link>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng sản phẩm</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng danh mục</span>
                    <span className="font-bold">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đơn hàng mới</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Người dùng</span>
                    <span className="font-bold">127</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Products Management */}
              <div id="products" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
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
                    <h3 className="text-lg font-semibold mb-4">Thêm phần mềm mới</h3>
                    
                    <form onSubmit={handleSubmit}>
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
                            <option value="office">Văn phòng</option>
                            <option value="design">Thiết kế</option>
                            <option value="development">Phát triển</option>
                            <option value="security">Bảo mật</option>
                            <option value="utility">Tiện ích</option>
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
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
                  {products.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                            <th className="py-2 px-4 border-b text-left">Danh mục</th>
                            <th className="py-2 px-4 border-b text-left">Giá</th>
                            <th className="py-2 px-4 border-b text-left">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b">{product.name}</td>
                              <td className="py-2 px-4 border-b">{product.categoryId}</td>
                              <td className="py-2 px-4 border-b">{formatCurrency(product.price)}</td>
                              <td className="py-2 px-4 border-b">
                                <button className="text-blue-600 hover:text-blue-800 mr-2">Sửa</button>
                                <button className="text-red-600 hover:text-red-800">Xóa</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có sản phẩm nào.</p>
                  )}
                </div>
              </div>
              
              {/* Categories Management */}
              <div id="categories" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Quản lý danh mục</h2>
                <p className="text-gray-500 mb-4">Quản lý danh mục sản phẩm trên hệ thống</p>
                
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm danh mục mới
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                      <h3 className="font-bold">Văn phòng</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">4 sản phẩm</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-4">Phần mềm và giải pháp văn phòng</p>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-sm">Sửa</button>
                        <button className="text-red-600 hover:text-red-900 text-sm">Xóa</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                      <h3 className="font-bold">Thiết kế</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">2 sản phẩm</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-4">Phần mềm thiết kế đồ họa chuyên nghiệp</p>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900 text-sm">Sửa</button>
                        <button className="text-red-600 hover:text-red-900 text-sm">Xóa</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 