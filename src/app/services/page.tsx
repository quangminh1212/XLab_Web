'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ServicesPage() {
  const { translate } = useLanguage();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-secondary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{translate('services.pageTitle')}</h1>
          <p className="text-xl max-w-3xl">
            {translate('services.pageDescription')}
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Service 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-secondary-100 text-secondary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-3">{translate('services.customSoftwareDev')}</h3>
                <p className="text-gray-600 mb-4">
                  {translate('services.customSoftwareDesc')}
                </p>
                <Link
                  href="/services/software-development"
                  className="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center"
                >
                  {translate('actions.learnMore')}
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

            {/* Service 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-secondary-100 text-secondary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-3">{translate('services.cloudServices')}</h3>
                <p className="text-gray-600 mb-4">
                  {translate('services.cloudServicesDesc')}
                </p>
                <Link
                  href="/services/cloud-services"
                  className="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center"
                >
                  {translate('actions.learnMore')}
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

            {/* Service 3 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-secondary-100 text-secondary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-3">{translate('services.techConsulting')}</h3>
                <p className="text-gray-600 mb-4">
                  {translate('services.techConsultingDesc')}
                </p>
                <Link
                  href="/services/consulting"
                  className="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center"
                >
                  {translate('actions.learnMore')}
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

            {/* Service 4 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex-shrink-0">
                <div className="bg-secondary-100 text-secondary-600 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-3">{translate('services.technicalSupport')}</h3>
                <p className="text-gray-600 mb-4">
                  {translate('services.technicalSupportDesc')}
                </p>
                <Link
                  href="/services/technical-support"
                  className="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center"
                >
                  {translate('actions.learnMore')}
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
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{translate('services.additionalServices')}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {translate('services.additionalServicesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">{translate('services.training')}</h3>
              <p className="text-gray-600">
                {translate('services.trainingDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">{translate('services.maintenance')}</h3>
              <p className="text-gray-600">
                {translate('services.maintenanceDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">{translate('services.systemIntegration')}</h3>
              <p className="text-gray-600">
                {translate('services.systemIntegrationDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">{translate('services.cybersecurity')}</h3>
              <p className="text-gray-600">
                {translate('services.cybersecurityDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">{translate('services.dataAnalytics')}</h3>
              <p className="text-gray-600">
                {translate('services.dataAnalyticsDesc')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">{translate('services.digitalTransformation')}</h3>
              <p className="text-gray-600">
                {translate('services.digitalTransformationDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-600 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">{translate('services.ctaTitle')}</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              {translate('services.ctaDescription')}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-secondary-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-full transition-colors"
            >
              {translate('services.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 