'use client';

import { useEffect, useState } from 'react';
import ProductGrid from './ProductGrid';
import { useLanguage } from '@/contexts/LanguageContext';

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
<<<<<<< HEAD
      <div className="mt-12 py-8 text-center text-gray-500">{t('system.loadingRelatedProducts')}</div>
=======
      <div className="mt-12 py-8 text-center text-gray-500">{t('product.loadingRelatedProducts')}</div>
>>>>>>> 0e6a978e2821224c596be981352e1ca98e6637ce
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
      const categoryObj = category as any;
      
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
    console.log('RelatedProducts - Raw product:', product);

    // Đảm bảo tất cả thuộc tính đều là primitive values
    const safeId = String(product.id || '');
    const safeName = String(product.name || '');
    const safeDescription = String(product.shortDescription || product.description || '');
    const safePrice = Number(product.price) || 0;
    const safeOriginalPrice = product.originalPrice ? Number(product.originalPrice) : undefined;
    
    // Xử lý trường hợp image hoặc imageUrl có thể là object thay vì string
    let safeImage = '';
    if (product.imageUrl) {
      if (typeof product.imageUrl === 'string') {
        safeImage = product.imageUrl;
      } else if (typeof product.imageUrl === 'object' && product.imageUrl !== null) {
        // Nếu imageUrl là object, thử lấy url từ object
        safeImage = (product.imageUrl as any).url || (product.imageUrl as any).src || '/images/placeholder/product-placeholder.jpg';
      }
    } else if (product.image) {
      if (typeof product.image === 'string') {
        safeImage = product.image;
      } else if (typeof product.image === 'object' && product.image !== null) {
        // Nếu image là object, thử lấy url từ object
        safeImage = (product.image as any).url || (product.image as any).src || '/images/placeholder/product-placeholder.jpg';
      }
    }
    
    // Nếu không có ảnh hợp lệ, sử dụng placeholder
    if (!safeImage) {
      safeImage = '/images/placeholder/product-placeholder.jpg';
    }

    const safeRating = product.rating ? Number(product.rating) : undefined;
    const safeReviewCount = product.reviewCount ? Number(product.reviewCount) : undefined;
    const safeIsAccount = Boolean(product.isAccount || product.type === 'account');

<<<<<<< HEAD
    // Xử lý category an toàn - giữ nguyên dạng object để ProductCard xử lý
    let safeCategory = '';
    
    // Helper function to extract category name from object
    const extractCategoryString = (categoryObj: any): string => {
      if (!categoryObj) return '';
      
      if (typeof categoryObj === 'string') {
        return categoryObj;
      }
      
      if (typeof categoryObj === 'object') {
        // Try to get name
        if (categoryObj.name) {
          if (typeof categoryObj.name === 'string') {
            return categoryObj.name;
          } else if (typeof categoryObj.name === 'object' && categoryObj.name.id) {
            return String(categoryObj.name.id);
          }
        }
        
        // Try to get id
        if (categoryObj.id) {
          if (typeof categoryObj.id === 'string') {
            return categoryObj.id;
          } else if (typeof categoryObj.id === 'object' && categoryObj.id.id) {
            return String(categoryObj.id.id);
          }
        }
      }
      
      return '';
    };
=======
    // Extract category as string only
    let categoryString;
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
    
    if (product.category) {
<<<<<<< HEAD
      safeCategory = extractCategoryString(product.category);
    }
    // Nếu có categories array
    else if (product.categories?.length) {
      safeCategory = extractCategoryString(product.categories[0]);
=======
      categoryString = getCategoryString(product.category);
    } else if (product.categories?.length) {
      categoryString = getCategoryString(product.categories[0]);
>>>>>>> 77d40f007c10996d4a8a25a577d10a9b0f3ca33d
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

    console.log('RelatedProducts - Mapped product:', mapped);
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
