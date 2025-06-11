'use client';

// Thêm comment này để kiểm tra hot-reload
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { HighlightProducts } from '@/components/product';
import { categories } from '@/data/mockData';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// Types
interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images?: Array<string | { url: string }>;
  imageUrl?: string;
  createdAt?: string;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  weeklyPurchases?: number;
  totalSold?: number;
  isAccount?: boolean;
  type?: string;
}

// Components
const SearchBar = ({ placeholder }: { placeholder: string }) => (
  <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm sm:text-base"
    />
    <button className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 sm:w-5 sm:h-5"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
    <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Helper function
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
  if (typeof product.imageUrl === 'string') {
    return product.imageUrl;
  }

  return '/images/placeholder/product-placeholder.jpg';
};

function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const result = await response.json();

        if (result.success && result.data) {
          setProducts(result.data);
        } else {
          console.error('Failed to fetch products:', result.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc sản phẩm mới nhất
  const newProducts = [...products]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || '0');
      const dateB = new Date(b.createdAt || '0');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 2);  // Chỉ lấy 2 sản phẩm mới nhất

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* New Products Section */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-8">home.newProducts</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {newProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
          )}
        </div>
      </div>

      {/* CTA Section - Banner dưới */}
      <section className="py-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to boost your productivity with XLab?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              We offer special discounts for customers who purchase in bulk. The more you
              buy, the higher the discount. We are committed to bringing you the best
              solutions at the most reasonable cost.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
