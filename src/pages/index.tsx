'use client';

import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Home() {
  const { translate, isLoaded } = useLanguage()

  return (
    <Layout>
      <Head>
        <title>XLab - Phần mềm riêng của bạn</title>
        <meta name="description" content="XLab cung cấp các ứng dụng, phần mềm chất lượng cao cho cá nhân và doanh nghiệp." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative">
        {/* Hero section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                {isLoaded ? translate('home.heroTitle') : 'XLab - Giải pháp phần mềm chất lượng cao'}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {isLoaded ? translate('home.heroSubtitle') : 'Các giải pháp phần mềm và dịch vụ công nghệ chất lượng cao cho doanh nghiệp của bạn'}
              </p>

              {/* Tìm kiếm */}
              <div className="max-w-2xl mx-auto mb-10">
                <div className="flex rounded-full overflow-hidden shadow-lg border border-gray-200 bg-white">
                  <input
                    type="text"
                    placeholder={isLoaded ? translate('actions.searchProducts') : 'Tìm kiếm sản phẩm...'}
                    className="flex-1 px-6 py-4 focus:outline-none"
                  />
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 font-medium transition-colors">
                    {isLoaded ? translate('actions.search') : 'Tìm kiếm'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sản phẩm nổi bật */}
            <div className="mt-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {isLoaded ? translate('home.featuredProducts') : 'Sản phẩm nổi bật'}
                </h2>
                <Link href="/products" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
                  {isLoaded ? translate('actions.viewAll') : 'Xem tất cả'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    {isLoaded ? translate('messages.systemUpdating') : 'Hệ thống đang được cập nhật. Vui lòng quay lại sau.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
} 