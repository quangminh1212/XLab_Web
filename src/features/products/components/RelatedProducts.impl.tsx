'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from '@/contexts/LanguageContext';

import ProductGrid from './ProductGrid';
import { getDisplayPrices } from '@/features/products/services/pricing';
import { getValidImageUrl as getValidProductImageUrl } from '@/features/products/services/images';

interface OptionPrice {
  price: number;
  originalPrice: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string | object;
  imageUrl?: string | object;
  category?: string | object;
  categories?: Array<string | { id: string | object; name: string | object; slug?: string | object }>;
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
  type?: string;
  totalSold?: number;
  weeklyPurchases?: number;
  defaultProductOption?: string;
  optionPrices?: { [key: string]: OptionPrice };
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
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
            const data = await categoryResponse.json();
            const allProducts = data.data || [];
            
            // Kiểm tra xem allProducts có phải là một mảng không
            if (Array.isArray(allProducts)) {
              // Filter out the current product
              const filtered = allProducts
                .filter((p: Product) => p.id !== currentProductId)
                .slice(0, limit);
              setProducts(filtered);
            } else {
              // console.error('Expected array but received:', allProducts);
              setProducts([]);
            }
          } else {
            setProducts([]);
          }
        } else {
          const data = await response.json();
          setProducts(data);
        }
      } catch (_error) {
        // console.error('Error fetching related products:', error);
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
      <div className="mt-12 py-8 text-center text-gray-500">Đang tải sản phẩm liên quan...</div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  // Helper function to extract string from category object
  const getCategoryString = (category: string | object | undefined): string | undefined => {
    if (!category) return undefined;
    
    if (typeof category === 'string') {
      return category;
    }
    
    if (typeof category === 'object' && category !== null) {
      const categoryObj = category as { name?: unknown; id?: unknown };
      
      if (categoryObj.name && typeof categoryObj.name === 'string') {
        return categoryObj.name;
      }
      
      if (categoryObj.id && typeof categoryObj.id === 'string') {
        return categoryObj.id;
      }
      
      return 'unknown';
    }
    
    return undefined;
  };

  const mappedProducts = products.map((product) => {
    // Đảm bảo tất cả thuộc tính đều là primitive values
    const safeId = String(product.id || '');
    const safeName = String(product.name || '');
    const safeDescription = String(product.shortDescription || product.description || '');

    // Dùng pricing service
    const { price: safePrice, originalPrice: safeOriginalPrice } = getDisplayPrices(product);

    // Lấy URL ảnh chuẩn hoá giống các section khác
    const safeImage = getValidProductImageUrl(product as any);

    const safeRating = product.rating ? Number(product.rating) : undefined;
    const safeReviewCount = product.reviewCount ? Number(product.reviewCount) : undefined;
    const safeIsAccount = Boolean(product.isAccount || product.type === 'account');

    // Extract category as string only
    let categoryString;
    
    if (product.category) {
      categoryString = getCategoryString(product.category);
    } else if (product.categories?.length) {
      categoryString = getCategoryString(product.categories[0]);
    }

    const mapped = {
      id: safeId,
      name: safeName,
      description: safeDescription,
      price: safePrice,
      originalPrice: safeOriginalPrice,
      image: safeImage,
      category: categoryString,
      rating: safeRating,
      reviewCount: safeReviewCount,
      isAccount: safeIsAccount,
      totalSold: product.totalSold || 0,
      weeklyPurchases: product.weeklyPurchases || 0,
    };

    // console.log('RelatedProducts - Mapped product:', mapped);
    return mapped;
  });

  return (
    <div className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductGrid
        products={mappedProducts}
        title={t('product.relatedProducts')}
        subtitle={t('product.relatedProductsSubtitle')}
        columns={3}
      />
    </div>
  );
}
