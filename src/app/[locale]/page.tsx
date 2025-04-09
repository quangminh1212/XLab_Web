'use client';

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import I18nProvider from '@/components/I18nProvider';

export default function HomePageWrapper({ params: { locale } }: { params: { locale: string } }) {
    return (
        <I18nProvider locale={locale}>
            <HomePage locale={locale} />
        </I18nProvider>
    );
}

function HomePage({ locale }: { locale: string }) {
    const { t } = useTranslation('common');

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-gray-50 to-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {t('home.title')}
                            </h1>
                            <p className="mt-4 text-xl text-gray-600">
                                {t('home.subtitle')}
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={`/${locale}/products`}
                                    className="px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
                                >
                                    {t('home.getStarted')}
                                </Link>
                                <Link
                                    href={`/${locale}/about`}
                                    className="px-6 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md border border-gray-200"
                                >
                                    {t('home.learnMore')}
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:flex justify-end">
                            <div className="relative h-96 w-full">
                                <Image
                                    src="/images/hero-image.png"
                                    alt="XLab hero image"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        {/* Tiêu đề phần Features */}
                        Giải pháp toàn diện cho doanh nghiệp của bạn
                    </h2>

                    {/* Feature items sẽ được hiển thị tại đây */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý dự án hiệu quả</h3>
                            <p className="text-gray-600">Theo dõi tiến độ và phân công công việc một cách dễ dàng với giao diện trực quan.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tối ưu hóa quy trình</h3>
                            <p className="text-gray-600">Tự động hóa các tác vụ lặp lại để tăng năng suất và giảm thiểu sai sót.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phân tích dữ liệu chuyên sâu</h3>
                            <p className="text-gray-600">Biến đổi dữ liệu thô thành thông tin hữu ích với các công cụ báo cáo trực quan.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 