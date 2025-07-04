import React, { useEffect, useState } from 'react';

import ProductGrid from '@/components/product/ProductGrid';
import { useLanguage } from '@/contexts/LanguageContext';

'use client';

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrl?: string;
  category?: string | object;
  categories?: Array<string | { id: string | object; name: string | object; slug?: string | object }>;
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
  type?: string;
  totalSold?: number;
  weeklyPurchases?: number;
  slug?: string;
}

interface CrossSellSectionProps {
  currentProductId: string;
  categoryId?: string;
  limit?: number;
}

// Dữ liệu mẫu để hiển thị khi API không hoạt động
const sampleProducts: Product[] = [
  {
    id: '101',
    name: 'ChatGPT Premium',
    description: 'Trải nghiệm chatbot AI tiên tiến nhất với khả năng hiểu và phản hồi như người thật',
    shortDescription: 'Trải nghiệm chatbot AI tiên tiến nhất với khả năng hiểu và phản hồi như người thật',
    price: 149000,
    originalPrice: 299000,
    image: '/images/products/chatgpt/chatgpt-premium.jpg',
    rating: 4.8,
    reviewCount: 120,
    isAccount: true,
    weeklyPurchases: 35,
    totalSold: 450,
    slug: 'chatgpt-premium'
  },
  {
    id: '102',
    name: 'Midjourney Creator',
    description: 'Công cụ AI tạo hình ảnh nghệ thuật từ văn bản với chất lượng cao',
    shortDescription: 'Công cụ AI tạo hình ảnh nghệ thuật từ văn bản với chất lượng cao',
    price: 249000,
    originalPrice: 399000,
    image: '/images/products/midjourney/midjourney-creator.jpg',
    rating: 4.7,
    reviewCount: 85,
    isAccount: true,
    weeklyPurchases: 28,
    totalSold: 320,
    slug: 'midjourney-creator'
  },
  {
    id: '103',
    name: 'Claude Advanced',
    description: 'AI trợ lý thông minh từ Anthropic, giải quyết các vấn đề phức tạp',
    shortDescription: 'AI trợ lý thông minh từ Anthropic, giải quyết các vấn đề phức tạp',
    price: 199000,
    originalPrice: 349000,
    image: '/images/products/claude/claude-advanced.jpg',
    rating: 4.6,
    reviewCount: 75,
    isAccount: true,
    weeklyPurchases: 22,
    totalSold: 280,
    slug: 'claude-advanced'
  },
  {
    id: '104',
    name: 'Stable Diffusion XL',
    description: 'Tạo hình ảnh chất lượng cao với nhiều tùy chỉnh chi tiết',
    shortDescription: 'Tạo hình ảnh chất lượng cao với nhiều tùy chỉnh chi tiết',
    price: 189000,
    originalPrice: 299000,
    image: '/images/products/stable-diffusion/stable-diffusion-xl.jpg',
    rating: 4.5,
    reviewCount: 60,
    isAccount: true,
    weeklyPurchases: 18,
    totalSold: 210,
    slug: 'stable-diffusion-xl'
  }
];

export default function CrossSellSection({ currentProductId, categoryId, limit = 4 }: CrossSellSectionProps) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // Thử lấy sản phẩm liên quan từ API
        const response = await fetch(
          `/api/products/related?productId=${currentProductId}&categoryId=${categoryId || ''}&limit=${limit}`,
        );

        if (response.ok) {
          const data = await response.json();
          // Nếu có dữ liệu hợp lệ, sử dụng nó
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
          } else {
            // Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
            setProducts(sampleProducts.filter(p => p.id !== currentProductId));
          }
        } else {
          // Nếu API thất bại, thử lấy sản phẩm cùng danh mục
          try {
            const fallbackResponse = await fetch(`/api/products?categoryId=${categoryId || ''}&limit=${limit + 1}`);
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              // Lọc bỏ sản phẩm hiện tại khỏi kết quả
              const filteredProducts = fallbackData.filter((p: Product) => p.id !== currentProductId).slice(0, limit);
              if (filteredProducts.length > 0) {
                setProducts(filteredProducts);
              } else {
                // Nếu không có sản phẩm liên quan, sử dụng dữ liệu mẫu
                setProducts(sampleProducts.filter(p => p.id !== currentProductId));
              }
            } else {
              // Nếu cả API backup cũng thất bại, sử dụng dữ liệu mẫu
              setProducts(sampleProducts.filter(p => p.id !== currentProductId));
            }
          } catch (error) {
            console.error('Không thể tải sản phẩm cùng danh mục:', error);
            setProducts(sampleProducts.filter(p => p.id !== currentProductId));
          }
        }
      } catch (error) {
        console.error('Không thể tải sản phẩm liên quan:', error);
        // Nếu có lỗi, sử dụng dữ liệu mẫu
        setProducts(sampleProducts.filter(p => p.id !== currentProductId));
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelatedProducts();
    }
  }, [currentProductId, categoryId, limit]);

  // Đảm bảo các thuộc tính sản phẩm đều là primitive values để tránh lỗi
  const safeProducts = products.map(product => {
    // Xử lý hình ảnh
    let imageUrl = '';
    if (typeof product.image === 'string') {
      imageUrl = product.image;
    } else if (typeof product.imageUrl === 'string') {
      imageUrl = product.imageUrl;
    } else {
      // Fallback to placeholder
      imageUrl = '/images/placeholder/product-placeholder.jpg';
    }

    // Xử lý mô tả ngắn
    const description = product.shortDescription || product.description || '';

    return {
      id: String(product.id),
      name: String(product.name),
      description,
      price: Number(product.price) || 0,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      image: imageUrl,
      rating: product.rating ? Number(product.rating) : undefined,
      reviewCount: product.reviewCount ? Number(product.reviewCount) : undefined,
      isAccount: Boolean(product.isAccount || product.type === 'account'),
      category: product.category,
      totalSold: product.totalSold || 0,
      weeklyPurchases: product.weeklyPurchases || 0,
      slug: product.slug || '',
    };
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-52 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ProductGrid
        products={safeProducts}
        title={t('product.relatedProducts')}
        subtitle={t('product.mightAlsoLike')}
        columns={4}
      />
    </div>
  );
} 