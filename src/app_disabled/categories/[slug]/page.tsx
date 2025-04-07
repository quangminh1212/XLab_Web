'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories, products } from '@/data/mockData';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const { translate, isLoaded } = useLanguage();
    const category = categories.find((cat) => cat.slug === params.slug);

    if (!category) {
        notFound();
    }

    // Ánh xạ slug sang key trong bản dịch
    const getCategoryTranslation = (categorySlug: string) => {
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

        const cat = categories.find(c => c.slug === categorySlug);
        return {
            name: cat?.name || '',
            description: cat?.description || ''
        };
    };

    const categoryTranslation = getCategoryTranslation(category.slug);
    const categoryProducts = products.filter((product) => product.categoryId === category.id);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <Link href="/categories" className="text-teal-600 flex items-center mb-4 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {isLoaded ? translate('categories.backToCategories') : 'Quay lại danh mục'}
                    </Link>

                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center mr-4">
                            <Image
                                src={category.imageUrl || '/images/placeholder.png'}
                                alt={categoryTranslation.name}
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{categoryTranslation.name}</h1>
                            <p className="text-gray-600 mt-1">{categoryTranslation.description}</p>
                        </div>
                    </div>
                </div>

                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                            >
                                <div className="aspect-video relative">
                                    <Image
                                        src={product.imageUrl || '/images/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h2>
                                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-teal-600 font-medium">
                                            {product.salePrice ? (
                                                <div className="flex items-center">
                                                    <span className="text-sm line-through text-gray-400 mr-2">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </span>
                                                    <span>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-teal-50 text-teal-600 text-xs rounded-full">
                                            {isLoaded ? translate('actions.viewDetails') : 'Xem chi tiết'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm</h3>
                        <p className="text-gray-500 max-w-lg mx-auto mb-6">
                            Chúng tôi đang cập nhật thêm các sản phẩm cho danh mục này
                        </p>
                        <Link
                            href="/categories"
                            className="text-white bg-teal-600 hover:bg-teal-700 rounded-full px-6 py-2 transition-colors font-medium shadow-sm inline-block"
                        >
                            Xem các danh mục khác
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
} 