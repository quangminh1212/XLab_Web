'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories, products } from '@/data/mockData';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

export default function CategoryPage({ params }: CategoryPageProps) {
    // Thiết lập tiêu đề trang
    useEffect(() => {
        document.title = 'Danh mục sản phẩm | XLab - Phần mềm và Dịch vụ';
    }, []);
    
    // Đảm bảo params và params.slug tồn tại
    if (!params || !params.slug) {
        return notFound();
    }
    
    const category = categories.find((cat) => cat?.slug === params.slug);

    if (!category) {
        return notFound();
    }

    // Đảm bảo category.id và mảng products tồn tại
    const categoryId = category?.id || '';
    const productsList = products || [];
    const categoryProducts = productsList.filter((product) => product?.categoryId === categoryId);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <Link href="/categories" className="text-teal-600 flex items-center mb-4 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại danh mục
                    </Link>

                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center mr-4">
                            <Image
                                src={category?.imageUrl || '/images/placeholder.png'}
                                alt={category?.name || 'Danh mục'}
                                width={48}
                                height={48}
                                className="object-contain"
                                unoptimized={true}
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{category?.name || 'Danh mục'}</h1>
                            <p className="text-gray-600 mt-1">{category?.description || ''}</p>
                        </div>
                    </div>
                </div>

                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                            product ? <ProductCard key={product.id} product={product} /> : null
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