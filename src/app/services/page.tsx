'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

// Client-only component to avoid hydration issues
function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false)
  
  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (!hasMounted) {
    return null
  }
  
  return <>{children}</>
}

export default function ServicesPage() {
  const { translate, isLoaded } = useLanguage();
  
  // Set page title
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Dịch vụ | XLab - Phần mềm và Dịch vụ'
    }
  }, [])

  // Danh sách dịch vụ chính
  const mainServices = [
    {
      id: 'custom-software',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'services.customSoftwareDev',
      description: 'services.customSoftwareDesc',
      link: '/services/software-development'
    },
    {
      id: 'cloud-services',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: 'services.cloudServices',
      description: 'services.cloudServicesDesc',
      link: '/services/cloud-services'
    },
    {
      id: 'tech-consulting',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'services.techConsulting',
      description: 'services.techConsultingDesc',
      link: '/services/consulting'
    },
    {
      id: 'tech-support',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'services.technicalSupport',
      description: 'services.technicalSupportDesc',
      link: '/services/technical-support'
    }
  ];

  // Danh sách dịch vụ bổ sung
  const additionalServices = [
    {
      id: 'training',
      title: 'services.training',
      description: 'services.trainingDesc'
    },
    {
      id: 'maintenance',
      title: 'services.maintenance',
      description: 'services.maintenanceDesc'
    },
    {
      id: 'system-integration',
      title: 'services.systemIntegration',
      description: 'services.systemIntegrationDesc'
    },
    {
      id: 'cybersecurity',
      title: 'services.cybersecurity',
      description: 'services.cybersecurityDesc'
    },
    {
      id: 'data-analytics',
      title: 'services.dataAnalytics',
      description: 'services.dataAnalyticsDesc'
    },
    {
      id: 'digital-transformation',
      title: 'services.digitalTransformation',
      description: 'services.digitalTransformationDesc'
    }
  ];

  // Fallback text cho trường hợp dịch không thành công
  const getTranslation = (key, fallback) => {
    return isLoaded ? translate(key) : fallback;
  };

  return (
    <ClientOnly>
      <div>
        {/* Page Header */}
        <section className="bg-secondary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-6">
                <Image
                  src="/images/logo.jpg"
                  alt="XLab Logo"
                  width={160}
                  height={160}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                {getTranslation('services.pageTitle', 'Dịch vụ của chúng tôi')}
              </h1>
              <p className="text-xl max-w-3xl text-center">
                {getTranslation('services.pageDescription', 'XLab cung cấp các dịch vụ phần mềm chất lượng cao cho cá nhân và doanh nghiệp.')}
              </p>
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {mainServices.map((service) => (
                <div key={service.id} className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex-shrink-0">
                    <div className="bg-secondary-100 text-secondary-600 rounded-full w-20 h-20 flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold mb-3">{getTranslation(service.title, 'Dịch vụ')}</h3>
                    <p className="text-gray-600 mb-4">
                      {getTranslation(service.description, 'Mô tả dịch vụ')}
                    </p>
                    <Link
                      href={service.link}
                      className="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center"
                    >
                      {getTranslation('actions.learnMore', 'Tìm hiểu thêm')}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {getTranslation('services.additionalServices', 'Các dịch vụ khác')}
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {getTranslation('services.additionalServicesDesc', 'Ngoài các dịch vụ chính, chúng tôi còn cung cấp nhiều dịch vụ bổ sung để đáp ứng mọi nhu cầu của bạn.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalServices.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-3">
                    {getTranslation(service.title, 'Dịch vụ bổ sung')}
                  </h3>
                  <p className="text-gray-600">
                    {getTranslation(service.description, 'Mô tả dịch vụ bổ sung')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary-600 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">
                {getTranslation('services.ctaTitle', 'Bạn cần hỗ trợ?')}
              </h2>
              <p className="text-xl max-w-3xl mx-auto mb-8">
                {getTranslation('services.ctaDescription', 'Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về dịch vụ phù hợp với nhu cầu của bạn.')}
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-secondary-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-full transition-colors"
              >
                {getTranslation('services.contactUs', 'Liên hệ với chúng tôi')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </ClientOnly>
  )
} 