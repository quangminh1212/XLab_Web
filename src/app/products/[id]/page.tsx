'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/mockData';
import { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tìm sản phẩm dựa trên slug
    try {
      const foundProduct = products.find(p => p.slug === params.id);
      if (foundProduct) {
        console.log("Đã tìm thấy sản phẩm:", foundProduct);
        setProduct(foundProduct);
        document.title = `${foundProduct.name} | XLab`;
      } else {
        console.log("Không tìm thấy sản phẩm với slug:", params.id);
        setError('Không tìm thấy sản phẩm');
      }
    } catch (err) {
      console.error("Lỗi khi tìm sản phẩm:", err);
      setError('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error || "Không tìm thấy sản phẩm"}</h1>
          <p className="mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/products" className="text-teal-600 hover:underline">← Quay lại danh sách sản phẩm</Link>
        </div>
      </div>
    );
  }

  // Nếu tìm thấy sản phẩm, hiển thị chi tiết
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
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
          
          <div className="md:w-2/3 p-4">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">
              Phiên bản {product.version} | Cập nhật: {new Date(product.updatedAt).toLocaleDateString()}
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
                onClick={() => {
                  // Tạo một file text đơn giản để tải xuống
                  const element = document.createElement('a');
                  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Đây là bản demo của ${product.name}`));
                  element.setAttribute('download', `${product.slug}-demo.txt`);
                  element.style.display = 'none';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
              >
                Tải xuống
              </button>
              
              <button className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Link href="/products" className="text-teal-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    </div>
  );
} 