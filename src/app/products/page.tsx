'use client';

import React, { useState, useEffect } from 'react';
import { categories } from '@/data/mockData';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductImage from '@/components/product/ProductImage';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/common/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductsPage() {
  const { t, setLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Establecer el idioma español al cargar
  useEffect(() => {
    setLanguage('es');
  }, [setLanguage]);

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
          throw new Error(t('products.loadError'));
        }

        const result = await response.json();
        // Use the data property from the API response
        if (result.success && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          setProducts([]);
          setError(t('products.invalidData'));
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message || t('products.error'));
        setLoading(false);
      }
    };

    fetchProducts();
  }, [t]);

  // Update title when component is rendered
  useEffect(() => {
    document.title = t('products.pageTitle');
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
    { id: 'all', name: t('products.all'), count: Array.isArray(allProducts) ? allProducts.length : 0 },
    {
      id: 'software',
      name: t('products.software'),
      count: Array.isArray(allProducts)
        ? allProducts.filter((p) => !p.isAccount && (p.type === 'software' || !p.type)).length
        : 0,
    },
    {
      id: 'service',
      name: t('products.service'),
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
          <p className="text-gray-600">{t('products.loading')}</p>
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
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('products.errorTitle')}</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-wrap justify-center gap-4">
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
              {t('products.tryAgain')}
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
              {t('products.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="py-12 container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('products.noResults')}</h3>
          <div className="mt-6">
            <Link
              href="/"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('products.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('products.title')}</h1>
        <p className="text-gray-600">{t('products.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4 w-full">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t('product.category')}</h3>
            <div className="space-y-2">
              {productCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md flex justify-between items-center transition-colors ${
                    filter === category.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      filter === category.id ? 'bg-primary-100' : 'bg-gray-100'
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">{t('products.sortBy')}</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSort('newest')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  sort === 'newest' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {t('products.newest')}
              </button>
              <button
                onClick={() => setSort('price-low')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  sort === 'price-low'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {t('products.priceLowToHigh')}
              </button>
              <button
                onClick={() => setSort('price-high')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  sort === 'price-high'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {t('products.priceHighToLow')}
              </button>
              <button
                onClick={() => setSort('popular')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  sort === 'popular'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {t('products.popular')}
              </button>
              <button
                onClick={() => setSort('rating')}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  sort === 'rating'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {t('products.rating')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 w-full">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={t('products.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {t('products.showing')} {sortedProducts.length} {t('products.results')}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
}
