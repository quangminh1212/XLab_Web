'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductProps {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  downloadCount?: number;
  createdAt?: string;
  category?: string;
  [key: string]: any;
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  // Đảm bảo có giá trị mặc định cho các thuộc tính
  const {
    id,
    name = 'Sản phẩm',
    slug = '',
    description = 'Không có mô tả',
    price = 0,
    imageUrl = '/images/products/placeholder.jpg',
    category = 'Chưa phân loại'
  } = product;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${id}`} className="block">
        <div className="relative h-48 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">Không có ảnh</span>
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Nổi bật
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${id}`} className="block">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 hover:text-primary-600 transition-colors">
            {name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {category}
          </div>
          
          {price > 0 ? (
            <div className="font-semibold text-primary-700">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
            </div>
          ) : (
            <div className="font-semibold text-green-600">
              Miễn phí
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 