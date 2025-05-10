'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import AdminEditProduct from '@/app/products/[id]/AdminEditProduct';
import { products } from '@/data/mockData';

interface AdminEditProductPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Trong dự án thực tế, sẽ gọi API để lấy thông tin sản phẩm
    // Ở đây chỉ giả lập bằng cách lấy từ dữ liệu mockData
    const fetchProduct = () => {
      try {
        const foundProduct = products.find(p => p.id === params.id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleSaveProduct = (updatedProduct: Product) => {
    // Trong dự án thực tế, sẽ gọi API để cập nhật sản phẩm
    // Ở đây chỉ mô phỏng việc cập nhật thành công và chuyển hướng
    console.log('Đã cập nhật sản phẩm:', updatedProduct);
    alert('Sản phẩm đã được cập nhật thành công!');
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Không tìm thấy sản phẩm'}</p>
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push('/admin/products')}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Quản lý sản phẩm</h1>
      
      <div className="mb-6">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => router.push('/admin/products')}
        >
          &larr; Quay lại danh sách
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">ID:</p>
              <p>{product.id}</p>
            </div>
            <div>
              <p className="font-semibold">Tên sản phẩm:</p>
              <p>{product.name}</p>
            </div>
            <div>
              <p className="font-semibold">Giá gốc:</p>
              <p>{product.price.toLocaleString('vi-VN')}₫</p>
            </div>
            <div>
              <p className="font-semibold">Giá khuyến mãi:</p>
              <p>{product.salePrice?.toLocaleString('vi-VN')}₫</p>
            </div>
            <div>
              <p className="font-semibold">Danh mục:</p>
              <p>{product.categoryId}</p>
            </div>
          </div>
        </div>

        <AdminEditProduct 
          product={product} 
          onSave={handleSaveProduct} 
        />
      </div>
    </div>
  );
} 