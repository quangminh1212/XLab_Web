'use client';

import { useState } from 'react';
import { categories } from '@/data/mockData';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Xử lý khi gửi form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Tạo form data từ form
    const formData = new FormData(event.currentTarget);
    
    // Tạo object sản phẩm từ form data
    const productData = {
      id: `prod-${Date.now()}`, // Tạo ID tạm thời
      name: formData.get('name')?.toString() || '',
      slug: formData.get('slug')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      longDescription: formData.get('description')?.toString() || '',
      price: Number(formData.get('price')) || 0,
      salePrice: 0,
      categoryId: formData.get('categoryId')?.toString() || '',
      imageUrl: '/images/products/placeholder-product.jpg',
      isFeatured: true, // Đặt mặc định là true để hiển thị ở mục "Phần mềm nổi bật"
      isNew: true,
      downloadCount: 0,
      viewCount: 0,
      rating: 0,
      version: '1.0',
      size: '10MB',
      licenseType: 'Standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storeId: '1'
    };
    
    console.log('Đang gửi sản phẩm:', productData);
    
    // Gửi API request để thêm sản phẩm
    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
      .then(response => {
        console.log('Phản hồi từ API:', response.status);
        if (!response.ok) {
          throw new Error('Lỗi khi thêm sản phẩm: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        // Thêm sản phẩm thành công
        console.log('Sản phẩm đã được thêm:', data);
        alert('Đã thêm sản phẩm thành công!');
        setIsLoading(false);
        setSubmitted(true);
        event.currentTarget.reset();
        
        // Chuyển hướng về trang chủ sau 2 giây
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      })
      .catch(error => {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi khi thêm sản phẩm! ' + error.message);
        setIsLoading(false);
      });
  };
  
  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Đã thêm sản phẩm thành công!</h2>
          <p className="text-green-700 mb-4">Đang chuyển hướng về trang chủ để xem sản phẩm...</p>
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý sản phẩm</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        
        <form method="POST" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">
                Tên phần mềm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Ví dụ: XLab Office Suite"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                placeholder="Ví dụ: xlab-office-suite"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                className="w-full border rounded-md px-4 py-2"
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
              <label className="block mb-2 font-medium">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                placeholder="Ví dụ: 1200000"
                className="w-full border rounded-md px-4 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Mô tả sản phẩm của bạn"
                className="w-full border rounded-md px-4 py-2"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-600 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng sản phẩm'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="text-center text-gray-500">
        Sau khi thêm sản phẩm, bạn có thể xem danh sách sản phẩm tại trang chủ.
      </div>
    </div>
  );
} 