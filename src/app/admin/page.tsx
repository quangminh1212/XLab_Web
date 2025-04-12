'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { toast, Toaster } from 'react-hot-toast';
import { addProduct, updateProduct } from "@/utils/api";
import { HiPlusCircle } from "react-icons/hi";

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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Kiểm tra quyền admin
  useEffect(() => {
    if (status === 'authenticated') {
      // Bỏ kiểm tra email cụ thể, cho phép tất cả người dùng đã đăng nhập
      // if (session?.user?.email !== 'xlab.rnd@gmail.com') {
      //   router.push('/');
      // } else {
      //   // Nếu là admin, tải danh sách sản phẩm
      //   fetchProducts();
      // }
      
      // Tải danh sách sản phẩm cho tất cả người dùng đã đăng nhập
      fetchProducts();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        console.error('Lỗi khi lấy sản phẩm:', result.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi gửi form
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    setIsLoading(true);
    setFormError('');
    
    try {
      const productData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        longDescription: formData.get('longDescription'),
        price: Number(formData.get('price')),
        salePrice: formData.get('salePrice') ? Number(formData.get('salePrice')) : null,
        categoryId: formData.get('categoryId'),
        imageUrl: formData.get('imageUrl'),
        version: formData.get('version'),
        size: formData.get('size'),
        licenseType: formData.get('licenseType'),
        isFeatured: formData.get('isFeatured') === 'on',
        isNew: formData.get('isNew') === 'on',
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success("Sản phẩm đã được cập nhật thành công!");
      } else {
        await addProduct(productData);
        toast.success("Sản phẩm đã được thêm thành công!");
      }
      form.reset();
      setNewImage(null);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError('Đã xảy ra lỗi khi xử lý yêu cầu');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi nhấn nút xóa
  const handleDelete = async (productId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Cập nhật lại danh sách sản phẩm
        await fetchProducts();
      } else {
        alert(result.message || 'Lỗi khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Đã xảy ra lỗi khi xóa sản phẩm');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Xử lý hủy form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormError('');
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      
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
                    <span className="font-bold">{products.length}</span>
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
                      setShowForm(!showForm);
                      setEditingProduct(null);
                      setFormError('');
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {showForm ? 'Đóng form' : 'Thêm sản phẩm mới'}
                  </button>
                </div>
                
                {formError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{formError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Form thêm/chỉnh sửa sản phẩm */}
                {showForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    
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
                            defaultValue={editingProduct?.name || ''}
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
                            defaultValue={editingProduct?.slug || ''}
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
                            defaultValue={editingProduct?.categoryId || ''}
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
                            defaultValue={editingProduct?.price || ''}
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
                            defaultValue={editingProduct?.version || ''}
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
                            defaultValue={editingProduct?.description || ''}
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
                            defaultValue={editingProduct?.longDescription || ''}
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
                            defaultValue={editingProduct?.imageUrl || ''}
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
                            defaultValue={editingProduct?.size || ''}
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
                            defaultValue={editingProduct?.licenseType || ''}
                            required
                          >
                            <option value="">-- Chọn loại giấy phép --</option>
                            <option value="Cá nhân">Cá nhân</option>
                            <option value="Thương mại">Thương mại</option>
                            <option value="Doanh nghiệp">Doanh nghiệp</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center">
                          <input 
                            type="checkbox" 
                            id="product-featured" 
                            name="isFeatured" 
                            className="mr-2" 
                            defaultChecked={editingProduct?.isFeatured}
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
                            defaultChecked={editingProduct?.isNew}
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
                          onClick={handleCancelForm}
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
                          {editingProduct ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
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
                          Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                            </div>
                          </td>
                        </tr>
                      ) : products.length > 0 ? (
                        products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-md"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder.png'
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.categoryId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                              {product.salePrice && product.salePrice < product.price && (
                                <div className="text-sm text-red-600">{formatCurrency(product.salePrice)}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {product.isFeatured && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Nổi bật
                                  </span>
                                )}
                                {product.isNew && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Mới
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-primary-600 hover:text-primary-900 mr-3"
                                onClick={() => handleEdit(product)}
                              >
                                Sửa
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDelete(product.id.toString())}
                                disabled={isDeleting}
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            Chưa có sản phẩm nào. Hãy thêm sản phẩm mới!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Categories Management */}
              <div id="categories" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm danh mục mới
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Phần mềm doanh nghiệp</h3>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Các phần mềm phục vụ cho doanh nghiệp như ERP, CRM, thanh toán...</p>
                    <p className="text-sm text-gray-500">Số sản phẩm: 4</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Ứng dụng văn phòng</h3>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Các ứng dụng văn phòng như soạn thảo, bảng tính, thuyết trình...</p>
                    <p className="text-sm text-gray-500">Số sản phẩm: 3</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Phần mềm đồ họa</h3>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Các phần mềm thiết kế, chỉnh sửa ảnh, video và đồ họa...</p>
                    <p className="text-sm text-gray-500">Số sản phẩm: 2</p>
                  </div>
                </div>
              </div>
              
              {/* Orders Management */}
              <div id="orders" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">ORD-001</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Nguyễn Văn A</div>
                          <div className="text-sm text-gray-500">nguyenvana@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">15/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">990.000₫</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Hoàn thành
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900">Xem chi tiết</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">ORD-002</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Trần Thị B</div>
                          <div className="text-sm text-gray-500">tranthib@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">18/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">12.000.000₫</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Đang xử lý
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900">Xem chi tiết</a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">ORD-003</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Lê Văn C</div>
                          <div className="text-sm text-gray-500">levanc@example.com</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">20/03/2025</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">1.990.000₫</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Đã thanh toán
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900">Xem chi tiết</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 