'use client';

import { useEffect, useState, memo, useCallback } from 'react';
import ProductGrid from './ProductGrid';

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

const RelatedProducts = memo(function RelatedProducts({ 
  currentProductId, 
  categoryId, 
  limit = 4 
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Fetch related products from API or import from data
        const response = await fetch(`/api/products/related?productId=${currentProductId}&categoryId=${categoryId || ''}&limit=${limit}`);
        
        if (!response.ok) {
          // Fallback: If API fails, try to fetch products from the same category
          const categoryResponse = await fetch(`/api/products?categoryId=${categoryId || ''}&limit=${limit + 1}`);
          if (categoryResponse.ok) {
            const allProducts = await categoryResponse.json();
            // Filter out the current product
            const filtered = allProducts.filter((p: Product) => p.id !== currentProductId).slice(0, limit);
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
    return <div className="mt-12 py-8 text-center text-gray-500">Đang tải sản phẩm liên quan...</div>;
  }

  if (products.length === 0) {
    return null;
  }

  const mappedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.shortDescription || product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.imageUrl || product.image,
    category: product.categories?.length ? product.categories[0].name : undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isAccount: product.isAccount || product.type === 'account'
  }));

  return (
    <div className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductGrid
        products={mappedProducts}
        title="Sản phẩm liên quan"
        subtitle="Bạn có thể quan tâm đến các sản phẩm khác tương tự"
        columns={4}
      />
    </div>
  );
});

export default RelatedProducts; 