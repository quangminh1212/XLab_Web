'use client';

import { useState, useEffect } from 'react';
import { categories } from '@/data/mockData';
import { Product } from '@/types';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Lấy danh sách sản phẩm từ API khi component được tải
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu sản phẩm');
        }
        const data = await response.json();
        setProducts(data);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        setLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
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
        
        // Thêm sản phẩm mới vào danh sách
        setProducts(prevProducts => [data, ...prevProducts]);
        
        event.currentTarget.reset();
      })
      .catch(error => {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi khi thêm sản phẩm! ' + error.message);
        setIsLoading(false);
      });
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
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
      
      {/* Danh sách sản phẩm đã đăng */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm đã đăng ({products.length})</h2>
        
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
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(product.categoryId.toString())}
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
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Đang bán
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có sản phẩm nào được đăng. Hãy thêm sản phẩm đầu tiên!</p>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-500 py-4">
        <p>Lưu ý: Sau khi thêm sản phẩm, cần đợi một lúc để trang chủ cập nhật dữ liệu mới.</p>
        <p className="mt-2">
          <a href="/" className="text-blue-500 hover:underline">Về trang chủ để xem sản phẩm</a>
        </p>
      </div>
    </div>
  );
} 