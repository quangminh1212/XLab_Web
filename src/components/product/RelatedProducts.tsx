'use client';

import { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import { useTranslation } from '@/i18n/useTranslation';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrl?: string;
  category?: string;
  categories?: { id: string; name: string }[];
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
  type?: string;
}

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  limit?: number;
}

export default function RelatedProducts({
  currentProductId,
  categoryId,
  limit = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Fetch related products from API or import from data
        const response = await fetch(
          `/api/products/related?productId=${currentProductId}&categoryId=${categoryId || ''}&limit=${limit}`,
        );

        if (!response.ok) {
          // Fallback: If API fails, try to fetch products from the same category
          const categoryResponse = await fetch(
            `/api/products?categoryId=${categoryId || ''}&limit=${limit + 1}`,
          );
          if (categoryResponse.ok) {
            const allProducts = await categoryResponse.json();
            // Filter out the current product
            const filtered = allProducts
              .filter((p: Product) => p.id !== currentProductId)
              .slice(0, limit);
            setProducts(filtered);
          } else {
            setProducts([]);
          }
        } else {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId, categoryId, limit]);

  if (loading) {
    return (
      <div className="mt-12 py-8 text-center text-gray-500">
        {locale === 'en' ? 'Loading related products...' : 'Đang tải sản phẩm liên quan...'}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const mappedProducts = products.map((product) => {
    console.log('RelatedProducts - Raw product:', product);

    // Đảm bảo tất cả thuộc tính đều là primitive values
    const safeId = String(product.id || '');
    const safeName = String(product.name || '');
    const safeDescription = String(product.shortDescription || product.description || '');
    const safePrice = Number(product.price) || 0;
    const safeOriginalPrice = product.originalPrice ? Number(product.originalPrice) : undefined;
    const safeImage = String(product.imageUrl || product.image || '');
    const safeRating = product.rating ? Number(product.rating) : undefined;
    const safeReviewCount = product.reviewCount ? Number(product.reviewCount) : undefined;
    const safeIsAccount = Boolean(product.isAccount || product.type === 'account');

    // Xử lý category an toàn
    let safeCategory;
    if (product.categories?.length) {
      const firstCategory = product.categories[0];
      if (typeof firstCategory === 'string') {
        safeCategory = firstCategory;
      } else if (firstCategory && typeof firstCategory === 'object') {
        // Kiểm tra các cấu trúc object có thể có
        safeCategory = String(firstCategory.name || firstCategory.id || '');
      }
    }

    const mapped = {
      id: safeId,
      name: safeName,
      description: safeDescription,
      price: safePrice,
      originalPrice: safeOriginalPrice,
      image: safeImage,
      category: safeCategory,
      rating: safeRating,
      reviewCount: safeReviewCount,
      isAccount: safeIsAccount,
    };

    console.log('RelatedProducts - Mapped product:', mapped);
    return mapped;
  });

  return (
    <div className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductGrid
        products={mappedProducts}
        title={t('product.relatedProducts')}
        subtitle={locale === 'en' 
          ? "You might be interested in these similar products" 
          : "Bạn có thể quan tâm đến các sản phẩm khác tương tự"}
        columns={4}
      />
    </div>
  );
}
