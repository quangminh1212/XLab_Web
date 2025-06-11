'use client';

// Thêm comment này để kiểm tra hot-reload
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
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

  // Lọc sản phẩm nổi bật (giả định tất cả sản phẩm đều là featured trong trường hợp này)
  const featuredProducts = products.slice(0, 6);

  // Lọc sản phẩm mới nhất
  const newProducts = [...products]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || '0');
      const dateB = new Date(b.createdAt || '0');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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

            <SearchBar placeholder={t('home.search')} />
          </div>
        </div>
      </section>

      {/* Productivity Boost Section - Phần mới thêm vào */}
      <section className="w-full bg-gradient-to-br from-primary-500 to-primary-600 text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {t('home.ctaDesc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 transform transition-all hover:scale-105 hover:bg-white/20">
                <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.3 1.046a.75.75 0 011.4.042l3.926 8.137h4.396a.75.75 0 01.578 1.268l-8.459 8.459a.75.75 0 01-1.268-.578v-4.396L2.41 11.7a.75.75 0 01.578-1.268h4.396L11.3 1.046z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">{t('home.aiIntegration')}</h3>
                <p className="text-sm text-white/80">{t('home.aiSupport')}</p>
              </div>
            
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 transform transition-all hover:scale-105 hover:bg-white/20">
                <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h5M20 20v-5h-5M5 10a8 8 0 0111.966-2.79M18.364 18.364A8 8 0 015 10"
                    />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">{t('home.continuousUpdates')}</h3>
                <p className="text-sm text-white/80">{t('home.newFeatures')}</p>
              </div>
            
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 transform transition-all hover:scale-105 hover:bg-white/20">
                <div className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7"
                  >
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">{t('home.support247')}</h3>
                <p className="text-sm text-white/80">{t('home.supportTeam')}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl inline-block"
              >
                {t('home.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-responsive">
        {/* Chuyển sang layout 2 cột với sidebar bên trái */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-responsive">
          {/* Sidebar Column - Left */}
          <div className="w-full flex flex-col h-full md:col-span-1">
            {/* About Section */}
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
            </section>

            {/* Thống kê - Phần mới */}
            <section className="bg-white rounded-xl shadow-sm p-4 mb-3">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('home.achievements')}</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary-100 rounded-lg p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary-600"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">10,000+</div>
                    <div className="text-xs text-gray-600">{t('home.customers')}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 rounded-lg p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-green-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">30+</div>
                    <div className="text-xs text-gray-600">{t('home.softwareSolutions')}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-lg p-3 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-blue-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.315 2.1c.663 0 1.32.087 1.946.254C14.5 1.817 17.52 2.119 19.388 3.036c1.05.517 1.173 1.146 1.087 1.486-.247.972-1.564 1.54-3.161 1.197a19.096 19.096 0 00-1.138-3.255c-.855.169-1.711.615-2.398 1.307a18.167 18.167 0 00-2.157-1.128c-.146.471-.4.824-.746 1.08-.072 1.249.383 2.289.841 3.483l.034.087c.894.471 1.561 1.123 1.946 1.89 1.231-.283 2.495-.038 3.366.704.301.255.513.621.513 1.029 0 1.117-.947 1.996-2.02 1.996-1.04 0-1.956-.809-2.03-1.882-1.031-.523-2.119-.92-2.95-1.133.512-.82.78-1.705.78-2.618 0-1.183-.512-2.339-1.384-3.098-.87-.76-2.072-1.146-3.29-1.073-.236.014-.468.024-.672.075a3.345 3.345 0 01-.707-.178z"
                        clipRule="evenodd"
                      />
                      <path d="M4.326 6.955c-1.196.822-1.256 2.396-.933 3.158.4.964 1.752 1.527 3.305 1.007 1.133-.38 2.035-1.41 2.459-2.628.276-.798.39-1.775.224-2.58-.229.279-.489.506-.777.679-.88.053-.18.121-.28.173a4.129 4.129 0 01-2.768.302c-.343-.074-.668-.161-.952-.264zm2.457 10.047c1.172 0 2.013-.823 2.013-1.834 0-.905-.66-1.607-1.596-1.758l-.189.492c-.71-.001-1.4-.205-1.998-.602-.644-.44-1.058-1.046-1.244-1.743-.594.276-1.136.657-1.553 1.12a3.307 3.307 0 00-.728 3.041c.199.757.7 1.404 1.376 1.819.677.414 1.523.57 2.338.403.257-.053.509-.13.75-.229-.009.075-.004.149.002.222.072.935.88 1.675 1.913 1.769.506.046 1.02-.088 1.397-.404.473-.329.766-.863.766-1.444 0-1.02-.857-1.862-2.045-1.862-.285 0-.554.05-.783.14l-.315-.414c-.019-.025-.038-.05-.057-.075.184-.15.368-.292.558-.44l.179-.145.479.619c.233-.11.486-.19.755-.234v-.497c-.577.11-1.123.348-1.605.773zm.16 1.835a.816.816 0 01-.702.747.756.756 0 01-.594-.14.691.691 0 01-.26-.548c0-.381.238-.695.572-.825.285-.11.56-.067.66.014.1.082.147.223.147.4 0 .138.06.27.17.352z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">5+</div>
                    <div className="text-xs text-gray-600">{t('home.yearsExperience')}</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Main Content Column - Right */}
          <div className="md:col-span-4 h-full">
            {/* Featured Products */}
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                {/* Featured Products Section */}
                <section className="mb-8 sm:mb-12">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="heading-3 text-gray-800">{t('home.featuredProducts')}</h2>
                    <Link href="/products" className="text-responsive-sm text-primary-600 hover:text-primary-700 font-medium">
                      {t('home.viewAll')}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {featuredProducts.map((product) => (
                      <div key={product.id} className="aspect-[1/1.3]">
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
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* New Products Section */}
                <section>
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="heading-3 text-gray-800">{t('home.newProducts')}</h2>
                    <Link href="/products" className="text-responsive-sm text-primary-600 hover:text-primary-700 font-medium">
                      {t('home.viewAll')}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {newProducts.map((product) => (
                      <div key={product.id} className="aspect-[1/1.3]">
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
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section - Thêm mới */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">XLab</h3>
              <p className="text-gray-400 mb-4">
                {t('footer.companyDesc')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.products')}</h3>
              <ul className="space-y-2">
                <li><a href="/products" className="text-gray-400 hover:text-white transition-colors">{t('footer.allProducts')}</a></li>
                <li><a href="/categories" className="text-gray-400 hover:text-white transition-colors">{t('footer.categories')}</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">{t('footer.pricing')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">{t('footer.contact')}</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">{t('footer.support')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© {new Date().getFullYear()} XLab. {t('footer.allRights')}</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.terms')}</a>
                <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.privacy')}</a>
                <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">{t('footer.cookies')}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
