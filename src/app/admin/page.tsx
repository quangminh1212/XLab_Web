'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

export const metadata = {
  title: 'Quản trị | XLab - Phần mềm và Dịch vụ',
  description: 'Trang quản trị XLab - Chỉ dành cho quản trị viên',
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Tải danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError('Không thể tải danh sách sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Tải sản phẩm khi trang được tải
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status]);
  
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

  // Xử lý khi gửi form thêm sản phẩm mới
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Lấy dữ liệu form
      const form = event.currentTarget;
      const formData = new FormData(form);
      
      // Chuyển đổi FormData thành object
      const formValues: Record<string, any> = Object.fromEntries(formData.entries());
      
      // Xử lý checkbox cho isFeatured và isNew
      formValues.isFeatured = formData.has('isFeatured');
      formValues.isNew = formData.has('isNew');
      
      // Gọi API để tạo sản phẩm mới
      const response = await fetch('/api/products/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Sản phẩm đã được thêm thành công!');
        form.reset();
        setShowForm(false);
        // Tải lại danh sách sản phẩm
        fetchProducts();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Xử lý sửa sản phẩm
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  
  // Xử lý cập nhật sản phẩm
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Lấy dữ liệu form
      const form = event.currentTarget;
      const formData = new FormData(form);
      
      // Chuyển đổi FormData thành object
      const formValues: Record<string, any> = Object.fromEntries(formData.entries());
      
      // Xử lý checkbox cho isFeatured và isNew
      formValues.isFeatured = formData.has('isFeatured');
      formValues.isNew = formData.has('isNew');
      
      // Gọi API để cập nhật sản phẩm
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Sản phẩm đã được cập nhật thành công!');
        setShowForm(false);
        setEditingProduct(null);
        // Tải lại danh sách sản phẩm
        fetchProducts();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi cập nhật sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Xử lý xóa sản phẩm
  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId);
    setIsDeleting(true);
  };
  
  const handleDelete = async () => {
    if (!deleteProductId) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Gọi API để xóa sản phẩm
      const response = await fetch(`/api/products/${deleteProductId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Sản phẩm đã được xóa thành công!');
        // Tải lại danh sách sản phẩm
        fetchProducts();
      } else {
        setError(data.error || 'Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      setError('Đã xảy ra lỗi khi kết nối với máy chủ');
    } finally {
      setIsSubmitting(false);
      setIsDeleting(false);
      setDeleteProductId(null);
    }
  };
  
  const closeDeleteModal = () => {
    setIsDeleting(false);
    setDeleteProductId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
  };
  
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

      {/* Thông báo */}
      {error && (
        <div className="container my-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Lỗi! </strong>
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError('')}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Đóng</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="container my-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Thành công! </strong>
            <span className="block sm:inline">{success}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccess('')}
            >
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Đóng</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
                    onClick={() => {
                      setEditingProduct(null);
                      setShowForm(!showForm);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
                  </button>
                </div>
                
                {/* Form thêm/sửa sản phẩm */}
                {showForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm phần mềm mới'}
                    </h3>
                    
                    <form onSubmit={editingProduct ? handleUpdate : handleSubmit}>
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
                            defaultValue={editingProduct?.name || ''}
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
                            defaultValue={editingProduct?.slug || ''}
                            readOnly={!!editingProduct}
                          />
                          {editingProduct && (
                            <p className="text-xs text-gray-500 mt-1">Slug không thể thay đổi sau khi tạo</p>
                          )}
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
                            defaultValue={editingProduct?.categoryId || ''}
                          >
                            <option value="">-- Chọn danh mục --</option>
                            <option value="cat-1">Phần mềm doanh nghiệp</option>
                            <option value="cat-2">Phần mềm văn phòng</option>
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
                            defaultValue={editingProduct?.price || ''}
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
                            defaultValue={editingProduct?.salePrice || ''}
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
                            defaultValue={editingProduct?.version || ''}
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
                            defaultValue={editingProduct?.description || ''}
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
                            defaultValue={editingProduct?.longDescription || ''}
                          ></textarea>
                        </div>
                        
                        <div>
                          <label htmlFor="product-image-url" className="block mb-2 font-medium text-gray-700">
                            URL hình ảnh <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="product-image-url"
                            name="imageUrl"
                            placeholder="/images/products/example.jpg"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            required
                            defaultValue={editingProduct?.imageUrl || ''}
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
                            defaultValue={editingProduct?.size || ''}
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
                            defaultValue={editingProduct?.licenseType || ''}
                          >
                            <option value="">-- Chọn loại giấy phép --</option>
                            <option value="Personal">Cá nhân</option>
                            <option value="Commercial">Thương mại</option>
                            <option value="Educational">Giáo dục</option>
                            <option value="Enterprise">Doanh nghiệp</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="product-store" className="block mb-2 font-medium text-gray-700">
                            Cửa hàng
                          </label>
                          <select
                            id="product-store"
                            name="storeId"
                            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                            defaultValue={editingProduct?.storeId || '1'}
                          >
                            <option value="1">XLab Software</option>
                            <option value="2">VN Tech Solutions</option>
                            <option value="3">Creative Tools</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center">
                          <input 
                            type="checkbox" 
                            id="product-featured" 
                            name="isFeatured" 
                            className="mr-2" 
                            defaultChecked={editingProduct?.isFeatured || false}
                          />
                          <label htmlFor="product-featured" className="text-gray-700">
                            Đánh dấu là sản phẩm nổi bật
                          </label>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center">
                          <input 
                            type="checkbox" 
                            id="product-new" 
                            name="isNew" 
                            className="mr-2" 
                            defaultChecked={editingProduct?.isNew || false}
                          />
                          <label htmlFor="product-new" className="text-gray-700">
                            Đánh dấu là sản phẩm mới
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-4">
                        <button 
                          type="button" 
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          onClick={() => editingProduct ? handleCancelEdit() : setShowForm(false)}
                        >
                          Hủy
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {editingProduct ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Danh sách sản phẩm */}
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="py-10 flex justify-center">
                      <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                    </div>
                  ) : products.length > 0 ? (
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
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
                                    src={product.imageUrl || '/images/placeholder-product.jpg'}
                                    alt={product.name}
                                    fill
                                    className="rounded-md object-cover"
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
                              <div className="text-sm text-gray-900">
                                {product.categoryId === 'cat-1' && 'Phần mềm doanh nghiệp'}
                                {product.categoryId === 'cat-2' && 'Phần mềm văn phòng'}
                                {product.categoryId === 'cat-3' && 'Phần mềm đồ họa'}
                                {product.categoryId === 'cat-4' && 'Bảo mật & Antivirus'}
                                {product.categoryId === 'cat-5' && 'Ứng dụng giáo dục'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                              {product.salePrice && product.salePrice < product.price && (
                                <div className="text-sm text-gray-500">{formatCurrency(product.salePrice)} (Sale)</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isNew ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {product.isNew ? 'Mới' : 'Đang bán'}
                              </span>
                              {product.isFeatured && (
                                <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                  Nổi bật
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-primary-600 hover:text-primary-900"
                                  onClick={() => handleEditClick(product)}
                                >
                                  Sửa
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteClick(product.id.toString())}
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-gray-500">Không có sản phẩm nào. Thêm sản phẩm mới để bắt đầu.</p>
                    </div>
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

      {/* Modal xác nhận xóa */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Xác nhận xóa sản phẩm
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDeleteModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 