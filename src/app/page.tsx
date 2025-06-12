'use client';

// Thêm comment này để kiểm tra hot-reload
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';
import { categories } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import HomeTestimonials from '@/components/home/Testimonials';
import HomePage from '@/components/home/HomePage';

// Types
interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images?: Array<string | { url: string }>;
  imageUrl?: string;
  createdAt?: string;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  weeklyPurchases?: number;
  totalSold?: number;
  isAccount?: boolean;
  type?: string;
}

// Components
const SearchBar = ({ placeholder }: { placeholder: string }) => (
  <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm sm:text-base"
    />
    <button className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 sm:w-5 sm:h-5"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="snap-start bg-white border border-gray-100 hover:border-primary-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
    <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Helper function
const getValidImageUrl = (product: Product): string => {
  if (!product) return '/images/placeholder/product-placeholder.jpg';

  // Kiểm tra nếu có hình ảnh trong mảng hình ảnh
  if (product.images && product.images.length > 0) {
    const imageUrl = product.images[0];
    // Kiểm tra xem đây là string hay object
    if (typeof imageUrl === 'string') {
      return imageUrl;
    } else if (imageUrl.url) {
      return imageUrl.url;
    }
  }

  // Kiểm tra nếu có thuộc tính imageUrl
  if (typeof product.imageUrl === 'string') {
    return product.imageUrl;
  }

  return '/images/placeholder/product-placeholder.jpg';
};

export default function Home() {
  const { setLanguage } = useLanguage();

  // Đặt ngôn ngữ thành tiếng Tây Ban Nha khi component được tải
  useEffect(() => {
    setLanguage('es');
  }, [setLanguage]);

  return <HomePage />;
}
