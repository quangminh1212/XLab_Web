'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartContext';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  id: string;
  name: string;
  description: string; // Mô tả ngắn của sản phẩm
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  isAccount?: boolean;
  weeklyPurchases?: number;
  totalSold?: number;
  slug?: string;
  onAddToCart?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  isAccount = false,
  weeklyPurchases = 0,
  totalSold = 0,
  slug = '',
  onAddToCart = () => {},
  onView = () => {},
}: ProductCardProps) {
  const t = useTranslations('ProductCard');
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAddedEffect, setShowAddedEffect] = useState(false);
  const router = useRouter();
  const { addItem, clearCart } = useCart();

  // Log the image URL for debugging
  console.log(`ProductCard image URL for ${name}:`, image);

  // Determine the image URL with thorough validation
  const getValidImageUrl = (imgUrl: string | null | undefined): string => {
    if (!imgUrl) return '/images/placeholder/product-placeholder.jpg';
    if (imgUrl.startsWith('blob:')) return '/images/placeholder/product-placeholder.jpg';
    if (imgUrl.includes('undefined')) return '/images/placeholder/product-placeholder.jpg';
    if (imgUrl.trim() === '') return '/images/placeholder/product-placeholder.jpg';

    // Nếu đường dẫn không tồn tại hoặc không hợp lệ, sử dụng placeholder
    try {
      // Kiểm tra nếu là đường dẫn tương đối
      if (imgUrl.startsWith('/')) {
        // Thêm domain nếu cần
        return imgUrl;
      }

      // Kiểm tra nếu là URL đầy đủ
      const url = new URL(imgUrl, window.location.origin);
      return url.toString();
    } catch (e) {
      // Nếu không phải URL hợp lệ, sử dụng placeholder
      return '/images/placeholder/product-placeholder.jpg';
    }
  };

  // Get the final image URL
  const cleanImageUrl = getValidImageUrl(image);

  // Sử dụng mô tả ngắn thay vì cắt mô tả dài
  const shortDescription = description || '';

  // Calculate discount only if originalPrice is higher than price
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // The actual image to display (with fallback) - moved up for use in handleAddToCart
  const displayImageUrl = imageError
    ? '/images/placeholder/product-placeholder.jpg'
    : cleanImageUrl;

  // Giả sử có một hàm để định dạng giá tiền theo tiền tệ VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                  ? 'text-yellow-400'
                  : 'text-gray-300'
            } mr-0.5`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {i === fullStars && hasHalfStar ? (
              <defs>
                <linearGradient id={`halfGradient-${id}-${i}`}>
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              fill={
                i === fullStars && hasHalfStar ? `url(#halfGradient-${id}-${i})` : 'currentColor'
              }
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
        {reviewCount > 0 && <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>}
      </div>
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Thêm sản phẩm vào giỏ hàng trực tiếp từ component
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image: displayImageUrl,
    });

    // Hiển thị hiệu ứng đã thêm vào giỏ
    setShowAddedEffect(true);
    setTimeout(() => {
      setShowAddedEffect(false);
    }, 1000);

    // Gọi callback nếu được cung cấp
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  const handleView = () => {
    if (onView) onView(id);
  };

  // Handle image error and use placeholder
  const handleImageError = () => {
    console.log(`Lỗi tải hình ảnh cho ${name}: ${cleanImageUrl}`);
    setImageError(true);
    setIsImageLoaded(true); // Mark as loaded to hide spinner
  };

  // Tạo slug từ tên nếu không có slug được truyền vào
  const productSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  return (
    <div
      className={`relative group bg-white rounded-2xl overflow-hidden shadow-sm border border-transparent transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-lg flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${productSlug}`} passHref onClick={handleView}>
        <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-2 border-primary-200 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={displayImageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className={`transition-transform duration-500 ease-in-out ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
            onError={handleImageError}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          ></div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            {category && (
              <span className="text-xs font-semibold uppercase text-primary-600 tracking-wider">
                {category}
              </span>
            )}
            <h3 className="text-base font-bold text-gray-800 mt-1 leading-tight truncate-2-lines">
              {name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-2 h-8 truncate-2-lines">
              {shortDescription}
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2">
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              {renderRatingStars(rating)}
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleAddToCart}
          className={`relative w-10 h-10 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 transform-gpu group-hover:scale-110`}
          aria-label={t('add_to_cart')}
        >
          {showAddedEffect ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
          <span className="absolute -top-8 -right-10 w-max bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {showAddedEffect ? t('added_to_cart') : t('add_to_cart')}
          </span>
        </button>
      </div>

      <div className="absolute top-2 left-2 z-10">
        {discountPercentage > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-2 z-10 text-xs text-gray-500 flex items-center space-x-2">
        {totalSold > 0 && (
          <div className="flex items-center bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-gray-700">{totalSold}+</span>&nbsp;{t('sold')}
          </div>
        )}
        {weeklyPurchases > 0 && (
          <div className="hidden sm:flex items-center bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.96-1.61l.713-4.278A2 2 0 0015.06 9.872l-1.31-1.31a.5.5 0 00-.707 0l-1.15 1.15a.5.5 0 01-.707 0l-1.15-1.15a.5.5 0 00-.707 0l-1.15 1.15a.5.5 0 01-.707 0L6 10.333z" />
            </svg>
            <span className="font-semibold text-gray-700">{weeklyPurchases}</span>&nbsp;{t('purchases_week')}
          </div>
        )}
      </div>
    </div>
  );
}
