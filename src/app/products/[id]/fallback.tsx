'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Component hiển thị khi JavaScript không tải được
export default function ProductFallback() {
  const router = useRouter();

  // Reload trang sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Đang tải thông tin sản phẩm</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-gray-200 w-full h-96 rounded-lg"></div>
            </div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">Đang tải thông tin chi tiết sản phẩm...</p>
        <p className="text-gray-500 mb-4">Trang sẽ tự động tải lại sau 3 giây</p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/products" 
            className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Quay lại trang sản phẩm
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Tải lại ngay
          </button>
        </div>
      </div>
    </div>
  );
} 