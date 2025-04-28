'use client';

import React, { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { products } from '@/data/mockData';
import ProductDetail from '@/app/products/[id]/ProductDetail';
import { Product } from '@/types';

export default function ProductPage({ params }: { params: { id: string } }) {
  // Thiết lập tiêu đề trang
  useEffect(() => {
    document.title = 'Chi tiết sản phẩm | XLab - Phần mềm và Dịch vụ';
  }, []);
  
  try {
    // Lấy productId từ params
    const { id: productId } = params;
    
    console.log(`Đang tìm kiếm sản phẩm với ID hoặc slug: ${productId}`);
    
    // Tìm sản phẩm theo slug trước (ưu tiên tìm theo slug để cải thiện SEO)
    let product = products.find(p => p.slug === productId);
    
    // Nếu không tìm thấy bằng slug, thử tìm bằng id
    if (!product) {
      product = products.find(p => p.id === productId);
    }
    
    // Nếu không tìm thấy sản phẩm, hiển thị trang not-found
    if (!product) {
      console.log(`Không tìm thấy sản phẩm với ID hoặc slug: ${productId}`);
      return notFound();
    }
    
    // Ghi log thông tin truy cập
    console.log(`Người dùng đang xem sản phẩm: ${product.name} (ID: ${product.id}, Slug: ${product.slug})`);
    
    // Truyền dữ liệu sản phẩm sang client component
    return <ProductDetail product={product} />;
  } catch (error) {
    console.error("Lỗi khi xử lý trang sản phẩm:", error);
    // Trả về một fallback UI mặc định khi có lỗi
    return <ProductDetail product={null} />;
  }
} 