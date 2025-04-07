import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProductsPage() {
  const { translate, isLoaded } = useLanguage()

  return (
    <Layout>
      <Head>
        <title>Sản phẩm | XLab</title>
        <meta name="description" content="Danh sách các sản phẩm phần mềm chất lượng cao của XLab" />
      </Head>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {isLoaded ? translate('navigation.products') : 'Sản phẩm'}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            Danh sách các sản phẩm phần mềm của XLab đang được cập nhật. Vui lòng quay lại sau.
          </p>
        </div>

        <div className="flex justify-center items-center py-16 bg-gray-50 rounded-xl">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {isLoaded ? translate('messages.productComingSoon') : 'Sản phẩm sắp ra mắt'}
            </h3>
            <p className="text-gray-500 max-w-lg mx-auto">
              {isLoaded ? translate('messages.systemUpdating') : 'Hệ thống đang được cập nhật. Vui lòng quay lại sau.'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 