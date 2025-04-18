'use client';

import { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface ProductUIProps {
  product: Product;
}

export default function ProductUI({ product }: ProductUIProps) {
  // State cho việc tải xuống
  const [downloading, setDownloading] = useState(false);
  
  // Xử lý tải xuống
  const handleDownload = () => {
    setDownloading(true);
    
    try {
      console.log(`Đang tải xuống: ${product.name}`);
      
      // Demo - tạo file văn bản để tải xuống
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
        encodeURIComponent(`Đây là bản demo của ${product.name}`));
      element.setAttribute('download', `${product.slug}-demo.txt`);
      element.style.display = 'none';
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Lỗi khi tải xuống:', error);
    } finally {
      setDownloading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Phần hình ảnh */}
          <div className="md:w-1/3 p-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-64">
              <Image
                src={product.imageUrl || '/images/placeholder-product.jpg'}
                alt={product.name}
                width={300}
                height={300}
                className="max-h-full max-w-full object-contain"
                unoptimized={true}
              />
            </div>
          </div>
          
          {/* Phần thông tin */}
          <div className="md:w-2/3 p-4">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">
              Phiên bản {product.version || '1.0'} | Cập nhật: {new Date(product.updatedAt).toLocaleDateString()}
            </p>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Mô tả chi tiết</h2>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-teal-600">
                {product.price === 0 ? 'Miễn phí' : 
                  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice || product.price)}
              </span>
              {product.salePrice && product.price > product.salePrice && (
                <span className="ml-2 text-gray-500 line-through">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleDownload}
                disabled={downloading}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {downloading ? 'Đang tải...' : 'Tải xuống'}
              </button>
              
              <button className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <a href="/products" className="text-teal-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách sản phẩm
        </a>
      </div>
    </div>
  );
} 