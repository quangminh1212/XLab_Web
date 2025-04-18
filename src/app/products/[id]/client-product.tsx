'use client';

import { Product } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface ClientProductDetailProps {
  product: Product;
}

export default function ClientProductDetail({ product }: ClientProductDetailProps) {
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = () => {
    setDownloading(true);
    
    try {
      console.log(`Đang tải xuống: ${product.name}`);
      
      // Tạo file văn bản đơn giản để tải xuống
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
    <div className="mt-6">
      <div className="flex mb-6">
        <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg">
          <Image
            src={product.imageUrl || '/images/placeholder-product.jpg'}
            alt={product.name}
            width={300}
            height={300}
            className="max-w-full object-contain mx-auto"
            unoptimized={true}
          />
        </div>
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