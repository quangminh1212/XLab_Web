import React from 'react'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ServicesPage() {
  const { translate, isLoaded } = useLanguage()

  const services = [
    {
      title: 'Phát triển phần mềm theo yêu cầu',
      description: 'Chúng tôi phát triển các ứng dụng và phần mềm tùy chỉnh đáp ứng chính xác nhu cầu kinh doanh của bạn.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: 'Tư vấn công nghệ',
      description: 'Đội ngũ chuyên gia của chúng tôi sẽ tư vấn giải pháp công nghệ phù hợp nhất cho doanh nghiệp của bạn.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Phát triển ứng dụng di động',
      description: 'Chúng tôi xây dựng ứng dụng di động chất lượng cao cho cả iOS và Android, với trải nghiệm người dùng tuyệt vời.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Phát triển website',
      description: 'Chúng tôi thiết kế và phát triển các website hiện đại, tốc độ cao và trải nghiệm người dùng xuất sắc.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ]

  return (
    <Layout>
      <Head>
        <title>Dịch vụ | XLab</title>
        <meta name="description" content="Các dịch vụ phát triển phần mềm chất lượng cao của XLab" />
      </Head>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {isLoaded ? translate('navigation.services') : 'Dịch vụ'}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Chúng tôi cung cấp các dịch vụ phát triển phần mềm chất lượng cao, đáp ứng nhu cầu đa dạng của khách hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-sm text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-teal-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quy trình làm việc</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi theo một quy trình rõ ràng để đảm bảo mỗi dự án được hoàn thành đúng tiến độ và chất lượng.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tư vấn & Phân tích</h3>
              <p className="text-gray-600 text-sm">Chúng tôi tìm hiểu nhu cầu và mục tiêu kinh doanh của bạn</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Thiết kế</h3>
              <p className="text-gray-600 text-sm">Chúng tôi thiết kế giải pháp phù hợp với nhu cầu của bạn</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Phát triển</h3>
              <p className="text-gray-600 text-sm">Chúng tôi phát triển giải pháp với công nghệ tiên tiến</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Triển khai & Hỗ trợ</h3>
              <p className="text-gray-600 text-sm">Chúng tôi triển khai giải pháp và hỗ trợ liên tục</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 