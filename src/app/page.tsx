'use client';

// Thêm comment này để kiểm tra hot-reload
import React, { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { categories } from '@/data/mockData';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper function to lấy URL ảnh hợp lệ
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

// Memo hóa các component con để tránh re-render không cần thiết
const AboutSection = memo(({ t }: { t: (key: string) => string }) => (
  <section className="bg-gray-50 rounded-xl overflow-hidden">
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 p-1 mb-responsive-sm">
      <div className="bg-white rounded-lg p-responsive-sm">
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 sm:w-12 sm:h-12 text-primary-600"
            >
              <path
                fillRule="evenodd"
                d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                clipRule="evenodd"
              />
              <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
            </svg>
          </div>
        </div>
        <h2 className="heading-3 mb-3 text-gray-800 text-center">{t('home.aboutTitle')}</h2>
        <p className="text-responsive-sm text-gray-700 mb-3">
          {t('home.aboutDesc1')}
        </p>
        <p className="text-responsive-sm text-gray-700 mb-3">
          {t('home.aboutDesc2')}
        </p>
        <div className="mt-4">
          <Link
            href="/about"
            className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-responsive-sm"
          >
            {t('home.learnMore')}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </section>
));

AboutSection.displayName = 'AboutSection';

// Memo hóa feature card để tránh re-render không cần thiết
const FeatureCard = memo(({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
    <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

// Memo hóa phần Hero section 
const HeroSection = memo(({ t }: { t: (key: string) => string }) => (
  <section className="w-full bg-gradient-to-br from-primary-50 via-white to-primary-50 py-6 sm:py-8 md:py-10 lg:py-12">
    <div className="container mx-auto px-responsive">
      <div className="flex flex-col items-center text-center">
        <h1 className="heading-1 mb-3 sm:mb-4 md:mb-6">
          <span className="text-gray-900">X</span>
          <span className="text-primary-500">Lab</span>
        </h1>
        <p className="text-responsive-lg text-gray-600 max-w-3xl mb-6 sm:mb-8">
          {t('home.slogan')}
        </p>

        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <input
            type="text"
            placeholder={t('home.search')}
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
      </div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

// Memo hóa component hiển thị danh sách sản phẩm
const ProductList = memo(({ title, products, viewAllLink }: { title: string, products: any[], viewAllLink: string }) => (
  <div className="bg-white rounded-xl p-responsive border border-gray-100 shadow-sm">
    <div className="flex justify-between items-center mb-responsive-sm">
      <h2 className="heading-3 text-gray-800">{title}</h2>
      <Link href={viewAllLink} className="text-primary-600 hover:text-primary-800 font-medium text-responsive-sm">
        Xem tất cả
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-responsive-sm">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
));

ProductList.displayName = 'ProductList';

function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
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

  // Lọc sản phẩm nổi bật (giả định tất cả sản phẩm đều là featured trong trường hợp này)
  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

  // Lọc sản phẩm mới nhất
  const newProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4);
  }, [products]);

  // Lọc danh mục
  const memoizedCategories = useMemo(() => categories.slice(0, 6), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection t={t} />

      <div className="container mx-auto py-responsive">
        {/* Chuyển sang layout 2 cột với sidebar bên trái */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-responsive">
          {/* Sidebar Column - Left */}
          <div className="w-full flex flex-col h-full md:col-span-1">
            {/* About Section */}
            <AboutSection t={t} />

            <div className="flex-1 overflow-y-auto p-2 space-y-3 snap-y snap-mandatory">
              <FeatureCard 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                } 
                title={t('home.domesticProduct')} 
                description={t('home.vietnamDevs')}
              />
              <FeatureCard 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                } 
                title={t('home.support247')} 
                description={t('home.supportTeam')}
              />
              <FeatureCard 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                } 
                title={t('home.highSecurity')} 
                description={t('home.encryptedData')}
              />
              <FeatureCard 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                } 
                title={t('home.reasonablePrice')} 
                description={t('home.budgetOptions')}
              />
              <FeatureCard 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.3 1.046a.75.75 0 011.4.042l3.926 8.137h4.396a.75.75 0 01.578 1.268l-8.459 8.459a.75.75 0 01-1.268-.578v-4.396L2.41 11.7a.75.75 0 01.578-1.268h4.396L11.3 1.046z"
                    />
                  </svg>
                } 
                title={t('home.aiIntegration')} 
                description={t('home.aiSupport')}
              />
              <FeatureCard 
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-primary-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h5M20 20v-5h-5M5 10a8 8 0 0111.966-2.79M18.364 18.364A8 8 0 015 10"
                    />
                  </svg>
                } 
                title={t('home.continuousUpdates')} 
                description={t('home.newFeatures')}
              />
            </div>

            {/* Categories Section */}
            <div className="rounded-xl overflow-hidden border border-gray-100 bg-white p-responsive-sm mt-responsive-sm">
              <h3 className="font-bold text-gray-800 mb-3">{t('home.categories')}</h3>
              <div className="space-y-2">
                {memoizedCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                      <span className="text-primary-600 text-sm font-medium">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-700 group-hover:text-primary-700 transition-colors">
                      {category.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 font-medium">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href="/categories"
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  {t('home.viewAllCategories')}
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Column - Right */}
          <div className="md:col-span-4 space-y-responsive">
            {/* Featured Products */}
            <ProductList
              title={t('home.featuredProducts')}
              products={featuredProducts}
              viewAllLink="/products"
            />

            {/* New Arrivals */}
            <ProductList
              title={t('home.newArrivals')}
              products={newProducts}
              viewAllLink="/products?sort=newest"
            />

            {/* Testimonials Section */}
            {/* ... Giữ nguyên phần này ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Xuất component như memo để tránh re-render không cần thiết
export default memo(HomePage);
