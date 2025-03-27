'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

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
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 7H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M17 7h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
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