'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  showMoreLink?: string;
  initialCount?: number;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  products,
  title = "Sản phẩm nổi bật",
  showMoreLink = "/products",
  initialCount = 6
}) => {
  const [visibleProducts, setVisibleProducts] = useState(initialCount);
  
  const showMore = () => {
    setVisibleProducts(prev => Math.min(prev + 6, products.length));
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showMoreLink && visibleProducts >= products.length && (
            <Link 
              href={showMoreLink}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, visibleProducts).map((product, index) => (
            <div key={product.id} className="h-full">
              <ProductCard 
                product={product} 
                className="h-full"
                priority={index < 3} // Prioritize loading for first 3 products
              />
            </div>
          ))}
        </div>

        {visibleProducts < products.length && (
          <div className="mt-10 text-center">
            <button
              onClick={showMore}
              className="btn btn-primary px-6"
            >
              Xem thêm sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts; 