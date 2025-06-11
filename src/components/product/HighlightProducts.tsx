'use client';

import React from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: Array<string | { url: string }>;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  totalSold?: number;
  weeklyPurchases?: number;
  slug?: string;
  isAccount?: boolean;
}

interface HighlightProductsProps {
  products: Product[];
  title?: string;
  viewAllLink?: string;
}

// Helper function for getting valid image URL
const getValidImageUrl = (product: Product): string => {
  if (!product) return '/images/placeholder/product-placeholder.jpg';

  // Kiểm tra nếu có hình ảnh trong mảng hình ảnh
  if (product.images && product.images.length > 0) {
    const imageUrl = product.images[0];
    // Kiểm tra xem đây là string hay object
    if (typeof imageUrl === 'string') {
      return imageUrl;
    } else if (imageUrl.url) {
      return imageUrl.url;
    }
  }

  // Kiểm tra nếu có thuộc tính imageUrl
  if (product.imageUrl) {
    return product.imageUrl;
  }

  // Kiểm tra nếu có thuộc tính image
  if (product.image) {
    return product.image;
  }

  return '/images/placeholder/product-placeholder.jpg';
};

const HighlightProducts = ({ products, title, viewAllLink = '/products' }: HighlightProductsProps) => {
  const { t } = useLanguage();

  if (!products || products.length < 2) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="heading-3 text-gray-800">{title}</h2>
          <Link href={viewAllLink} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {t('home.viewAll')}
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        {products.slice(0, 2).map((product) => (
          <div key={product.id} className="h-full flex">
            <ProductCard 
              id={product.id}
              name={product.name}
              description={product.shortDescription || product.description || ''}
              price={product.price}
              originalPrice={product.originalPrice}
              image={getValidImageUrl(product)}
              rating={product.rating}
              reviewCount={product.reviewCount}
              weeklyPurchases={product.weeklyPurchases}
              totalSold={product.totalSold}
              slug={product.slug}
              isAccount={product.isAccount}
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighlightProducts; 