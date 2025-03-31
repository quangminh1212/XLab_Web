'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CategoriesPage() {
    const { translate, isLoaded } = useLanguage();

    // Hàm để lấy tên và mô tả đã được dịch cho từng loại danh mục
    const getCategoryTranslation = (categorySlug: string) => {
        // Ánh xạ slug sang key trong bản dịch
        const slugToTranslationKey: Record<string, string> = {
            'phan-mem-doanh-nghiep': 'businessSoftware',
            'ung-dung-van-phong': 'officeApps',
            'phan-mem-do-hoa': 'graphicSoftware',
            'bao-mat-antivirus': 'security',
            'ung-dung-giao-duc': 'education'
        };

        const translationKey = slugToTranslationKey[categorySlug];

        if (translationKey && isLoaded) {
            return {
                name: translate(`categories.categoriesList.${translationKey}.name`),
                description: translate(`categories.categoriesList.${translationKey}.description`)
            };
        }

        const category = categories.find(cat => cat.slug === categorySlug);
        return {
            name: category?.name || '',
            description: category?.description || ''
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLoaded ? translate('categories.pageTitle') : 'Danh mục sản phẩm'}
                    </h1>
                    <p className="text-gray-600">
                        {isLoaded ? translate('categories.pageDescription') : 'Khám phá các phần mềm của chúng tôi theo danh mục'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => {
                        const categoryTranslation = getCategoryTranslation(category.slug);
                        return (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                            >
                                <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                                    <Image
                                        src={category.imageUrl || '/images/placeholder-product.jpg'}
                                        alt={categoryTranslation.name}
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{categoryTranslation.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow">
                                    {categoryTranslation.description}
                                </p>
                                <div className="flex items-center text-teal-600 font-medium text-sm">
                                    <span>
                                        {isLoaded ? translate('categories.productCount') : 'Sản phẩm: '}
                                        {category.productCount}
                                    </span>
                                    <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 