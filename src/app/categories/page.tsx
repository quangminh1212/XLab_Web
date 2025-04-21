'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/mockData';

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Danh mục sản phẩm</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">Khám phá bộ sưu tập phần mềm và ứng dụng đa dạng của chúng tôi, được phân loại để giúp bạn dễ dàng tìm kiếm giải pháp phù hợp nhất.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-gray-100 flex flex-col hover:border-teal-200 hover:-translate-y-1 duration-300"
                        >
                            <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 aspect-[2/1] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="relative h-full flex items-center justify-center p-8">
                                    <Image
                                        src={category.imageUrl || '/images/placeholder.png'}
                                        alt={category.name}
                                        width={100}
                                        height={100}
                                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                                        unoptimized={true}
                                    />
                                </div>
                                
                                <div className="absolute bottom-3 left-3">
                                    <span className="px-3 py-1 bg-white/90 text-teal-700 text-xs font-medium rounded-full shadow-sm">
                                        {category.productCount} sản phẩm
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    {category.name}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">
                                    {category.description}
                                </p>
                                <div className="flex items-center mt-auto text-teal-600 font-medium text-sm">
                                    <span>Xem danh mục</span>
                                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {/* Phần giới thiệu dưới danh mục */}
                <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0 md:max-w-xl">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Bạn chưa tìm thấy phần mềm phù hợp?</h2>
                            <p className="text-gray-600">
                                Liên hệ với đội ngũ hỗ trợ của chúng tôi để nhận tư vấn và tìm kiếm giải pháp phù hợp nhất cho nhu cầu của bạn.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link 
                                href="/contact"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                Liên hệ hỗ trợ
                            </Link>
                            <Link 
                                href="/products"
                                className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-5 py-3 rounded-lg font-medium transition-colors"
                            >
                                Xem tất cả sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 