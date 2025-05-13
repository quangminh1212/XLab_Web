'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories, products } from '@/data/mockData';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductImage from '@/components/product/ProductImage';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const category = categories.find((cat) => cat.slug === params.slug);

    if (!category) {
        return notFound();
    }

    const categoryProducts = products.filter((product) => product.categoryId === category.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                    <nav className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Danh Mục</h2>
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/categories/${cat.slug}`}>
                                        <div className={`flex items-center py-2 px-3 rounded-md ${
                                            cat.id === category.id 
                                            ? 'bg-primary-50 text-primary-600 font-medium' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}>
                                            <span>{cat.name}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="md:col-span-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h1>
                        <p className="text-gray-600">
                            Hiển thị {categoryProducts.length} sản phẩm thuộc danh mục {category.name}
                        </p>
                    </div>

                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                            <ProductCard 
                                key={product.id}
                                id={product.id.toString()}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                originalPrice={(product.salePrice && product.salePrice < product.price) ? product.price : undefined}
                                image={product.imageUrl}
                                rating={product.rating}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <Image
                            src="/images/empty-box.svg"
                            alt="Không có sản phẩm"
                            width={120}
                            height={120}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-xl font-medium text-gray-900 mb-2">Không có sản phẩm</h2>
                        <p className="text-gray-600 mb-4">
                            Hiện tại chưa có sản phẩm nào thuộc danh mục này. Vui lòng quay lại sau.
                        </p>
                        <Link href="/products">
                            <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                                Xem tất cả sản phẩm
                            </div>
                        </Link>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
} 