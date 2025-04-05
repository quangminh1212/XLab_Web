'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryList from '@/components/CategoryList';
import { categories } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { errorLog } from '@/utils/debugHelper';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function HomePage() {
  const { translate, isLoaded } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [lastVisit, setLastVisit] = useLocalStorage<string>('lastVisit', '');
  
  // Kiểm tra và debug browser environment
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Ghi nhận thời gian truy cập
        setLastVisit(new Date().toISOString());
        
        // Kiểm tra JSON methods
        try {
          const testObj = { test: true };
          const jsonStr = JSON.stringify(testObj);
          const parsed = JSON.parse(jsonStr);
          console.log('JSON methods hoạt động tốt:', parsed.test === true);
        } catch (jsonError) {
          errorLog('Lỗi với JSON methods:', jsonError);
        }
        
        // In thông tin browser
        console.log('User Agent:', navigator.userAgent);
        
        setLoaded(true);
      }
    } catch (error) {
      errorLog('Lỗi trong useEffect của Home:', error);
    }
  }, [setLastVisit]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full bg-gradient-to-br from-teal-50 via-white to-teal-50 py-10 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gray-900">X</span><span className="text-teal-600">Lab</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8">
              {isLoaded ? translate('home.heroSubtitle') : 'Các giải pháp phần mềm và dịch vụ công nghệ chất lượng cao cho doanh nghiệp của bạn'}
            </p>

            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder={isLoaded ? translate('actions.search') : 'Tìm kiếm...'}
                className="w-full px-4 py-3 pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-3 mx-auto max-w-7xl">
        <section className="py-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">{isLoaded ? translate('navigation.categories') : 'Danh mục'}</h2>
            <Link href="/categories" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              {isLoaded ? translate('actions.viewAll') : 'Xem tất cả'}
            </Link>
          </div>

          <CategoryList categories={categories} />
        </section>

        {/* Featured products */}
        <section className="py-12 bg-white">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{isLoaded ? translate('home.featuredProducts') : 'Sản phẩm nổi bật'}</h2>
              <Link
                href="/products"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                {isLoaded ? translate('actions.viewAll') : 'Xem tất cả'}
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">{isLoaded ? translate('messages.productComingSoon') : 'Sản phẩm sắp ra mắt'}</h3>
                <p className="text-gray-500 max-w-lg mx-auto">
                  {isLoaded ? translate('messages.systemUpdating') : 'Hệ thống đang được cập nhật. Vui lòng quay lại sau.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New products */}
        <section className="py-12 bg-gray-50">
          <div className="container max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{isLoaded ? translate('home.newProducts') : 'Sản phẩm mới'}</h2>
              <Link
                href="/products"
                className="text-teal-600 hover:text-teal-800 transition-colors"
              >
                {isLoaded ? translate('actions.viewAll') : 'Xem tất cả'}
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">{isLoaded ? translate('messages.productComingSoon') : 'Sản phẩm sắp ra mắt'}</h3>
                <p className="text-gray-500 max-w-lg mx-auto">
                  {isLoaded ? translate('messages.systemUpdating') : 'Hệ thống đang được cập nhật. Vui lòng quay lại sau.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Phần debug - chỉ hiển thị trong môi trường development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 border border-red-300 rounded-md bg-red-50">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Debug Info</h3>
          <p className="text-sm text-gray-700">
            JSON object available: {typeof JSON !== 'undefined' ? 'Yes' : 'No'}<br />
            JSON.parse method: {typeof JSON !== 'undefined' && typeof JSON.parse === 'function' ? 'Available' : 'Not available'}<br />
            Browser: {typeof window !== 'undefined' ? navigator.userAgent : 'Server Side Rendering'}<br />
            Last Visit: {lastVisit || 'None'}<br />
            Component Loaded: {loaded ? 'Yes' : 'No'}
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage; 