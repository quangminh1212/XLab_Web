'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import ProductCard from '@/components/product/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/mockData';
import { useLangFetch } from '@/lib/langFetch';

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const lfetch = useLangFetch(language);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');
  const [_searchTerm, _setSearchTerm] = useState<string>('');

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
        const result = await lfetch(`/api/products`, { retries: 2 });
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
  }, [t, language, lfetch]);

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
        if (_searchTerm.trim() !== '') {
          const search = _searchTerm.toLowerCase();
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
  const _featuredProducts = Array.isArray(allProducts)
    ? allProducts.filter((product) => product.isFeatured)
    : [];

  const _newProducts = Array.isArray(allProducts)
    ? allProducts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()).getTime() -
            new Date(a.createdAt || Date.now()).getTime(),
        )
        .slice(0, 6)
    : [];

  const _popularProducts = Array.isArray(allProducts)
    ? allProducts
        .slice()
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 6)
    : [];

  // Danh mục sản phẩm
  const _productCategories = [
    { id: 'all', name: 'Tất cả', count: Array.isArray(allProducts) ? allProducts.length : 0 },
    {
      id: 'software',
      name: 'Phần mềm',
      count: Array.isArray(allProducts)
        ? allProducts.filter((p) => !p.isAccount && (p.type === 'software' || !p.type)).length
        : 0,
    },
    {
      id: 'service',
      name: 'Dịch vụ',
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
    if (!product) return '/images/placeholder/product-placeholder.svg';

    // Kiểm tra nếu có hình ảnh trong mảng hình ảnh
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0];
      // Kiểm tra xem đây là string hay object
      if (typeof imageUrl === 'string') {
        return imageUrl.replace(/\\/g, '/');
      } else if (imageUrl.url) {
        return String(imageUrl.url).replace(/\\/g, '/');
      }
    }

    // Kiểm tra nếu có thuộc tính imageUrl
    if (product.imageUrl) {
      return product.imageUrl;
    }

    return '/images/placeholder/product-placeholder.svg';
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
                  d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
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
    <div className="container-full sm:container mx-auto px-0 sm:px-4 py-6 sm:py-8">
      <div className="bg-gray-50 py-4">
        <div className="mx-auto px-0 md:px-4 max-w-[100%] xl:max-w-[1280px] 2xl:max-w-[1400px]">
          <h1 className="text-3xl font-bold mb-2">{t('products.title')}</h1>
          
          <div className="mb-6">
            <p className="text-sm md:text-base text-gray-600">
              {t('products.subtitle')}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <button
                onClick={() => setFilter('all')}
                className={`py-2 px-2 ${filter === 'all' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm md:text-base`}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  {t('products.all')}
                </div>
              </button>
              <button
                onClick={() => setFilter('software')}
                className={`py-2 px-2 ${filter === 'software' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm md:text-base`}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t('products.software')}
                </div>
              </button>
              <button
                onClick={() => setFilter('service')}
                className={`py-2 px-2 ${filter === 'service' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'} font-medium text-sm md:text-base`}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-5 md:w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {t('products.service')}
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Main content */}
            <div className="w-full">
              {/* Filters bar */}
              <div className="bg-white p-2 rounded-lg shadow-sm mb-3 flex flex-wrap justify-between items-center">
                <div className="text-sm md:text-base text-gray-600">
                  {t('products.showing', { count: sortedProducts.length })}
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm md:text-base text-gray-700">
                    {t('products.sortBy')}:
                  </label>
                  <select
                    id="sort"
                    className="text-sm md:text-base border-gray-200 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">{t('products.sortNewest')}</option>
                    <option value="price-low">{t('products.sortPriceLow')}</option>
                    <option value="price-high">{t('products.sortPriceHigh')}</option>
                    <option value="popular">{t('products.sortPopular')}</option>
                  </select>
                </div>
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                {sortedProducts.map((product) => {
                  // console.debug(`[DEV] Product ${product.id} image data:`, product.images);

                  // Xác định giá hiển thị - ưu tiên tùy chọn mặc định nếu có
                  const displayPrice = 
                    product.defaultProductOption && product.optionPrices && product.optionPrices[product.defaultProductOption]
                      ? product.optionPrices[product.defaultProductOption].price
                      : product.versions && product.versions.length > 0
                        ? product.versions[0].price || 0
                        : product.price || 0;

                  // Xác định giá gốc - ưu tiên tùy chọn mặc định nếu có
                  const originalPrice =
                    product.defaultProductOption && product.optionPrices && product.optionPrices[product.defaultProductOption]
                      ? product.optionPrices[product.defaultProductOption].originalPrice
                      : product.versions && product.versions.length > 0
                        ? product.versions[0].originalPrice || 0
                        : product.salePrice || 0;

                  // Lấy ảnh sản phẩm (sử dụng helper function)
                  const imageUrl = getValidImageUrl(product);

                  try {
                    console.warn('[IMG] /products item', { id: product.id, name: product.name, first: (product.images && product.images[0]) || product.imageUrl, final: imageUrl });
                  } catch { /* no-op */ }

                  return (
                    <div key={product.id}>
                      <ProductCard
                        id={product.id.toString()}
                        name={product.name}
                        description={product.shortDescription || product.description || ''}
                        price={displayPrice}
                        originalPrice={originalPrice > displayPrice ? originalPrice : undefined}
                        image={imageUrl}
                        category={categories.find((c) => c.id === product.categoryId)?.name}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        weeklyPurchases={product.weeklyPurchases}
                        totalSold={product.totalSold}
                        slug={product.slug}
                        isAccount={product.isAccount || product.type === 'account'}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to format currency
function _formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
