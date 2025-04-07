import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/mockData';

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh mục sản phẩm</h1>
                    <p className="text-gray-600">Khám phá các phần mềm của chúng tôi theo danh mục</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                        >
                            <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                                <Image
                                    src={category.imageUrl}
                                    alt={category.name}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h2>
                            <p className="text-gray-600 text-sm mb-4 flex-grow">
                                {category.description}
                            </p>
                            <div className="flex items-center text-teal-600 font-medium text-sm">
                                <span>Sản phẩm: {category.productCount}</span>
                                <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
} 