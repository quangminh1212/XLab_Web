'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  imageUrl?: string;
  category?: string;
  categoryId?: string;
  rating?: number;
  reviewCount?: number;
  totalSold?: number;
  isAccount?: boolean;
  type?: string;
  slug?: string;
  weeklyPurchases?: number;
}

interface ProductListProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  limit?: number;
}

const ProductList = ({ title, products, viewAllLink, limit = 6 }: ProductListProps) => {
  const { t } = useLanguage();
  const displayProducts = products.slice(0, limit);

  // Helper function để lấy URL hình ảnh hợp lệ
  const getValidImageUrl = (product: Product): string => {
    if (!product) return '/images/placeholder/product-placeholder.jpg';

    // Kiểm tra nếu có hình ảnh
    if (product.image) {
      return product.image;
    }

    // Kiểm tra nếu có thuộc tính imageUrl
    if (product.imageUrl) {
      return product.imageUrl;
    }

    return '/images/placeholder/product-placeholder.jpg';
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-1 font-medium"
          >
            {t('common.viewAll')}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => {
          const imageUrl = getValidImageUrl(product);
          const displayPrice = product.price || 0;
          const originalPrice = product.originalPrice || product.price || 0;

          return (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              name={product.name}
              description={product.shortDescription || product.description || ''}
              price={displayPrice}
              originalPrice={originalPrice > displayPrice ? originalPrice : undefined}
              image={imageUrl}
              rating={product.rating}
              reviewCount={product.reviewCount}
              weeklyPurchases={product.weeklyPurchases}
              totalSold={product.totalSold}
              slug={product.slug}
              isAccount={product.isAccount || product.type === 'account'}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProductList; 