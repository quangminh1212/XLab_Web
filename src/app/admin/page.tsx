'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('Sản phẩm mẫu');
  const [slug, setSlug] = useState('san-pham-mau');
  const [description, setDescription] = useState('Đây là sản phẩm mẫu');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?_=${Date.now()}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Load sản phẩm khi component được mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Xử lý khi nhấn nút đăng sản phẩm
  const handlePostProduct = async () => {
    try {
      setIsLoading(true);
      setMessage('');
      setIsError(false);
      
      console.log('Đang gửi dữ liệu sản phẩm...');
      
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
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Đăng sản phẩm thành công!');
        fetchProducts(); // Tải lại danh sách sản phẩm
      } else {
        setIsError(true);
        setMessage(result.message || 'Đăng sản phẩm thất bại');
      }
    } catch (error: any) {
      setIsError(true);
      setMessage(`Lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý sản phẩm</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
        
        {message && (
          <div className={`p-4 mb-4 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Tên sản phẩm</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            ></textarea>
          </div>
          
          <div 
            className={`p-3 text-center rounded cursor-pointer bg-blue-500 text-white ${isLoading ? 'opacity-70' : 'hover:bg-blue-600'}`}
            onClick={isLoading ? undefined : handlePostProduct}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng sản phẩm'}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Danh sách sản phẩm ({products.length})</h2>
        
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
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
                            className="rounded-md object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg';
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chưa có sản phẩm nào được đăng</p>
          </div>
        )}
      </div>
    </div>
  );
} 