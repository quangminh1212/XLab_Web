'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ServicesPage() {
  const { translate } = useLanguage();

  // Danh sách các danh mục phần mềm và số lượng sản phẩm
  const softwareCategories = [
    {
      id: 'business',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: translate('software.businessSoftware'),
      count: 4,
    },
    {
      id: 'office',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: translate('software.officeSoftware'),
      count: 3,
    },
    {
      id: 'design',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      title: translate('software.designSoftware'),
      count: 2,
    },
    {
      id: 'security',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: translate('software.securitySoftware'),
      count: 1,
    },
    {
      id: 'education',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      title: translate('software.educationSoftware'),
      count: 2,
    },
  ];

  // Phần mềm nổi bật
  const featuredSoftware = [
    {
      id: 'xmanager',
      title: translate('software.xManager'),
      description: translate('software.xManagerDesc'),
      image: '/images/software/xmanager.png'
    },
    {
      id: 'cloudbackup',
      title: translate('software.cloudBackup'),
      description: translate('software.cloudBackupDesc'),
      image: '/images/software/cloudbackup.png'
    },
    {
      id: 'secureoffice',
      title: translate('software.secureOffice'),
      description: translate('software.secureOfficeDesc'),
      image: '/images/software/secureoffice.png'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {translate('software.pageTitle')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {translate('software.pageDescription')}
            </p>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm text-gray-600"
                placeholder={translate('software.searchPlaceholder')}
              />
              <button className="absolute right-2 top-2 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục phần mềm */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{translate('software.categories')}</h2>
            <Link href="/software/all" className="text-primary-500 hover:text-primary-600 font-medium">
              {translate('software.viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {softwareCategories.map((category) => (
              <Link
                key={category.id}
                href={`/software/category/${category.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-gray-100"
              >
                <div className="flex justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{category.title}</h3>
                <p className="text-gray-600">{category.count} {translate('software.products')}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Phần mềm nổi bật */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{translate('software.featured')}</h2>
            <Link href="/software/featured" className="text-primary-500 hover:text-primary-600 font-medium">
              {translate('software.viewAll')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSoftware.map((software) => (
              <div key={software.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {/* Ở đây chúng ta sẽ hiển thị hình ảnh nếu có */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{software.title}</h3>
                  <p className="text-gray-600 mb-4">{software.description}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/software/${software.id}`} className="text-primary-500 hover:text-primary-600 font-medium">
                      {translate('software.details')}
                    </Link>
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                      {translate('software.download')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Yêu cầu phần mềm tùy chỉnh */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{translate('software.customTitle')}</h2>
            <p className="text-xl mb-8">{translate('software.customDescription')}</p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {translate('software.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 