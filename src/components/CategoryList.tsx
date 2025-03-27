'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { ProductImage } from './ProductImage';

interface CategoryListProps {
  categories: Category[];
}

// Hàm chọn biểu tượng phù hợp cho từng loại danh mục
const getCategoryIcon = (categorySlug: string) => {
  switch (categorySlug) {
    case 'phan-mem-doanh-nghiep':
      return (
        <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5V19H21V5H3ZM19 17H5V7H19V17Z" fill="currentColor"/>
          <path d="M7 9H9V11H7V9Z" fill="currentColor"/>
          <path d="M11 9H17V11H11V9Z" fill="currentColor"/>
          <path d="M7 13H9V15H7V13Z" fill="currentColor"/>
          <path d="M11 13H17V15H11V13Z" fill="currentColor"/>
        </svg>
      );
    case 'ung-dung-van-phong':
      return (
        <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM5 19V5H19V19H5Z" fill="currentColor"/>
          <path d="M7 12H9V17H7V12Z" fill="currentColor"/>
          <path d="M11 7H13V17H11V7Z" fill="currentColor"/>
          <path d="M15 9H17V17H15V9Z" fill="currentColor"/>
        </svg>
      );
    case 'phan-mem-do-hoa':
      return (
        <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'bao-mat-antivirus':
      return (
        <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'ung-dung-giao-duc':
      return (
        <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return (
        <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
};

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
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors overflow-hidden relative">
            <ProductImage
              src={category.imageUrl || '/placeholder-product.jpg'}
              alt={category.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-0 group-hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all">
              {getCategoryIcon(category.slug)}
            </div>
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