'use client';

import React, { useState, useEffect } from 'react';
import { categories } from '@/data/mockData';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductImage from '@/components/product/ProductImage';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/common/button';
import { useTranslations } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('Products');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Set filter from URL params
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && ['all', 'software', 'service'].includes(filterParam)) {
      setFilter(filterParam);
    }
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error(t('error_loading'));
        }

        const result = await response.json();
        // Use the data property from the API response
        if (result.success && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
          setError(t('error_invalid_data'));
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || t('error_generic'));
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  // Update title when component is rendered
  useEffect(() => {
    document.title = t('meta_title');
  }, [t]);

  // Lọc tất cả sản phẩm (bao gồm phần mềm và dịch vụ)
  const allProducts = Array.isArray(products) ? products : [];

  // Lọc theo danh mục và tìm kiếm
  const filteredProducts = Array.isArray(allProducts)
    ? allProducts.filter((product) => {
        // Lọc theo loại sản phẩm
        if (filter === 'software') {
          if (product.isAccount || product.type === 'account') return false;
        } else if (filter === 'service') {
          if (!product.isAccount && product.type !== 'account') return false;
        } else if (filter !== 'all' && product.categoryId !== filter) {
          return false;
        }

        // Lọc theo tìm kiếm
        if (searchTerm.trim() !== '') {
          const search = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search))
          );
        }

        return true;
      })
    : [];

  // Sắp xếp sản phẩm
  const sortedProducts = Array.isArray(filteredProducts)
    ? [...filteredProducts].sort((a, b) => {
        if (sort === 'newest') {
          return (
            new Date(b.createdAt || Date.now()).getTime() -
            new Date(a.createdAt || Date.now()).getTime()
          );
        } else if (sort === 'price-low') {
          return (a.salePrice || a.price || 0) - (b.salePrice || b.price || 0);
        } else if (sort === 'price-high') {
          return (b.salePrice || b.price || 0) - (a.salePrice || a.price || 0);
        } else if (sort === 'popular') {
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        } else if (sort === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      })
    : [];

  // Lọc các loại sản phẩm đặc biệt
  const featuredProducts = Array.isArray(allProducts)
    ? allProducts.filter((product) => product.isFeatured)
    : [];

  const newProducts = Array.isArray(allProducts)
    ? allProducts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()).getTime() -
            new Date(a.createdAt || Date.now()).getTime(),
        )
        .slice(0, 6)
    : [];

  const popularProducts = Array.isArray(allProducts)
    ? allProducts
        .slice()
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 6)
    : [];

  // Danh mục sản phẩm
  const productCategories = [
    { id: 'all', name: t('all_categories'), count: Array.isArray(allProducts) ? allProducts.length : 0 },
    {
      id: 'software',
      name: t('software_category'),
      count: Array.isArray(allProducts)
        ? allProducts.filter((p) => !p.isAccount && (p.type === 'software' || !p.type)).length
        : 0,
    },
    {
      id: 'service',
      name: t('service_category'),
      count: Array.isArray(allProducts)
        ? allProducts.filter((p) => p.isAccount || p.type === 'account').length
        : 0,
    },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: Array.isArray(allProducts)
        ? allProducts.filter((p) => p.categoryId === cat.id).length
        : 0,
    })),
  ];

  // Helper function to safely get a valid image URL
  const getValidImageUrl = (product: any): string => {
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

    return '/images/placeholder/product-placeholder.jpg';
  };

  // Only show loading for a maximum of 1 second
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 flex justify-center">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('error_loading')}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t('try_again')}
            </button>
            <Link
              href="/"
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('go_home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 md:p-12 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Khám phá các sản phẩm của chúng tôi
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-100 max-w-3xl mx-auto">
            Tìm kiếm các giải pháp phần mềm và dịch vụ hàng đầu để đáp ứng mọi nhu cầu của bạn.
          </p>
          <div className="mt-8">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-lg mx-auto px-4 py-3 rounded-full border-gray-300 shadow-sm focus:ring-primary-400 focus:border-primary-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('filter_by_category')}</h3>
                <ul className="space-y-2">
                  {productCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => setFilter(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          filter === category.id
                            ? 'bg-primary-100 text-primary-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('sort_by')}</h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">{t('sort_newest')}</option>
                  <option value="price-low">{t('sort_price_low')}</option>
                  <option value="price-high">{t('sort_price_high')}</option>
                  <option value="popular">{t('sort_popular')}</option>
                  <option value="rating">{t('sort_rating')}</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    description={product.shortDescription || ''}
                    price={product.price || 0}
                    originalPrice={product.salePrice}
                    image={getValidImageUrl(product)}
                    category={categories.find((c) => c.id === product.categoryId)?.name}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    weeklyPurchases={product.weeklyPurchases}
                    totalSold={product.totalSold}
                    slug={product.slug}
                    isAccount={product.isAccount || product.type === 'account'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900">
                  {t('no_products_found')}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Vui lòng thử lại với các bộ lọc hoặc từ khóa tìm kiếm khác.
                </p>
              </div>
            )}

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t('featured_products')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                     <ProductCard
                     key={product.id}
                     id={product.id.toString()}
                     name={product.name}
                     description={product.shortDescription || ''}
                     price={product.price || 0}
                     originalPrice={product.salePrice}
                     image={getValidImageUrl(product)}
                     category={categories.find((c) => c.id === product.categoryId)?.name}
                     rating={product.rating}
                     reviewCount={product.reviewCount}
                     weeklyPurchases={product.weeklyPurchases}
                     totalSold={product.totalSold}
                     slug={product.slug}
                     isAccount={product.isAccount || product.type === 'account'}
                   />
                  ))}
                </div>
              </section>
            )}

            {/* New Products Section */}
            {newProducts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t('new_products')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {newProducts.map((product) => (
                     <ProductCard
                     key={product.id}
                     id={product.id.toString()}
                     name={product.name}
                     description={product.shortDescription || ''}
                     price={product.price || 0}
                     originalPrice={product.salePrice}
                     image={getValidImageUrl(product)}
                     category={categories.find((c) => c.id === product.categoryId)?.name}
                     rating={product.rating}
                     reviewCount={product.reviewCount}
                     weeklyPurchases={product.weeklyPurchases}
                     totalSold={product.totalSold}
                     slug={product.slug}
                     isAccount={product.isAccount || product.type === 'account'}
                   />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
