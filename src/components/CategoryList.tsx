'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { ProductImage } from './ProductImage';

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chưa có danh mục nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group flex flex-col items-center bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all hover:border-primary-200"
        >
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors overflow-hidden">
            <ProductImage
              src={category.imageUrl || '/placeholder-product.jpg'}
              alt={category.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
          <h3 className="text-sm font-medium text-gray-900 text-center group-hover:text-primary-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
            {category.description}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList; 