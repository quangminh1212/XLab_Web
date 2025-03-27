'use client';

import React from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '', priority = false }) => {
  const {
    id,
    name,
    slug,
    description,
    price,
    salePrice,
    imageUrl,
    rating,
    downloadCount,
    license,
    featured
  } = product;

  return (
    <Link 
      href={`/products/${slug}`}
      className={`group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all ${className} ${featured ? 'ring-2 ring-primary-500 ring-opacity-50' : ''}`}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <div className="flex items-center justify-center h-full">
          <ProductImage
            src={imageUrl || '/placeholder-product.jpg'}
            alt={name}
            width={96}
            height={96}
            className="w-auto h-auto max-h-40 p-3"
          />
        </div>
        
        {featured && (
          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            Nổi bật
          </div>
        )}
        
        {salePrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round(((price - salePrice) / price) * 100)}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-md font-semibold text-gray-900 line-clamp-2">{name}</h3>
        
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">({rating})</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {salePrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900">{formatCurrency(salePrice)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">{formatCurrency(price)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">{formatCurrency(price)}</span>
            )}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>{downloadCount}+</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 