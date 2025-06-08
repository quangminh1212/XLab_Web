'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/shared/utils/formatters';

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
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAddedEffect, setShowAddedEffect] = useState(false);
  const router = useRouter();
  const { addItem, clearCart } = useCart();
  const { language, t } = useLanguage();

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

  // Sử dụng hàm formatCurrency từ utility
  const formatProductPrice = (amount: number) => {
    return formatCurrency(amount, language);
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
        {reviewCount > 0 && (
          <span className="ml-1 text-xs text-gray-500">
            ({reviewCount} {t('product.reviews')})
          </span>
        )}
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

  // Color palette phù hợp với logo XLab (chuyên nghiệp, hiện đại)
  const colorPalette = [
    {
      name: 'teal',
      bg: 'from-white via-primary-50 to-primary-100',
      hover: 'hover:border-primary-300 hover:shadow-primary-100/50',
      badge: 'from-primary-500 to-primary-600',
      button: 'from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
      buttonHover: 'hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300',
      price: 'from-primary-600 to-primary-700',
      stats: 'text-primary-600',
      statsIcon: 'text-primary-500',
      overlay: 'to-primary-900/40',
    },
    {
      name: 'blue',
      bg: 'from-white via-blue-50 to-blue-100',
      hover: 'hover:border-blue-300 hover:shadow-blue-100/50',
      badge: 'from-blue-500 to-blue-600',
      button: 'from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
      buttonHover: 'hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300',
      price: 'from-primary-600 to-primary-700',
      stats: 'text-primary-600',
      statsIcon: 'text-blue-500',
      overlay: 'to-blue-900/40',
    },
    {
      name: 'purple',
      bg: 'from-white via-purple-50 to-purple-100',
      hover: 'hover:border-purple-300 hover:shadow-purple-100/50',
      badge: 'from-purple-500 to-purple-600',
      button: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      buttonHover: 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300',
      price: 'from-purple-600 to-purple-700',
      stats: 'text-purple-600',
      statsIcon: 'text-purple-500',
      overlay: 'to-purple-900/40',
    },
    {
      name: 'emerald',
      bg: 'from-white via-emerald-50 to-emerald-100',
      hover: 'hover:border-emerald-300 hover:shadow-emerald-100/50',
      badge: 'from-emerald-500 to-emerald-600',
      button: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      buttonHover: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300',
      price: 'from-emerald-600 to-emerald-700',
      stats: 'text-emerald-600',
      statsIcon: 'text-emerald-500',
      overlay: 'to-emerald-900/40',
    },
    {
      name: 'orange',
      bg: 'from-white via-orange-50 to-orange-100',
      hover: 'hover:border-orange-300 hover:shadow-orange-100/50',
      badge: 'from-orange-500 to-orange-600',
      button: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      buttonHover: 'hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300',
      price: 'from-orange-600 to-orange-700',
      stats: 'text-orange-600',
      statsIcon: 'text-orange-500',
      overlay: 'to-orange-900/40',
    },
  ];

  // Chọn màu dựa trên productId để đảm bảo cùng sản phẩm luôn có cùng màu sắc
  const colorIndex = Number(id.replace(/\D/g, '')) % colorPalette.length;
  const color = colorPalette[colorIndex] || colorPalette[0];

  // Link sản phẩm
  const productUrl = `/products/${encodeURIComponent(productSlug)}`;

  // Format các giá trị số
  const formattedPrice = formatProductPrice(price);
  const formattedOriginalPrice = originalPrice ? formatProductPrice(originalPrice) : '';

  return (
    <Link
      href={productUrl}
      className={`relative flex flex-col h-full border rounded-xl overflow-hidden transition-all duration-300 bg-gradient-to-b ${color.bg} ${color.hover} shadow hover:shadow-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Header - Image & Discount Badge */}
      <div className="relative rounded-t-xl overflow-hidden bg-white aspect-square">
        {/* Discount Badge if there's a discount */}
        {discountPercentage > 0 && (
          <div
            className={`absolute z-10 top-2 left-2 text-xs font-medium py-1 px-2 rounded-full text-white bg-gradient-to-r ${color.badge}`}
          >
            -{discountPercentage}%
          </div>
        )}

        {/* Image with fallback */}
        <div className="relative w-full h-full">
          {!isImageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={displayImageUrl}
            alt={name}
            fill={true}
            className={`object-contain transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={handleImageError}
          />

          {/* Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-transparent ${
              color.overlay
            } opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}
          ></div>
        </div>

        {/* "Added to Cart" effect */}
        {showAddedEffect && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30 animate-fade-out">
            <div className="bg-white rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-600 animate-check"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3 flex flex-col justify-between">
        {/* Name & Description */}
        <div>
          <h3 className="text-gray-900 font-semibold text-base leading-tight mb-1 line-clamp-2">
            {name}
          </h3>
          <p className="text-gray-600 text-xs leading-snug mb-2 line-clamp-2">{shortDescription}</p>

          {/* Rating Stars */}
          {rating > 0 && <div className="mb-2">{renderRatingStars(rating)}</div>}
        </div>

        {/* Footer - Price & CTA */}
        <div className="mt-auto">
          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-x-2 mb-2">
            <div
              className={`text-base font-bold bg-clip-text text-transparent bg-gradient-to-r ${color.price}`}
            >
              {formattedPrice}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-xs text-gray-500 line-through">
                {t('product.originalPrice')} {formattedOriginalPrice}
              </div>
            )}
          </div>

          {/* Social Proof - Purchaces */}
          {(weeklyPurchases > 0 || totalSold > 0) && (
            <div className={`flex items-center mb-3 text-xs ${color.stats}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3.5 w-3.5 mr-1 ${color.statsIcon}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {totalSold > 0 && <>{totalSold} {t('product.sold')}</>}
                {weeklyPurchases > 0 && totalSold > 0 && <> · </>}
                {weeklyPurchases > 0 && <>+{weeklyPurchases} {t('product.thisWeek')}</>}
              </span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex space-x-2">
            <Link
              href={productUrl}
              className={`flex-1 text-center text-xs sm:text-sm py-1.5 px-2 text-white font-medium rounded-lg bg-gradient-to-r ${color.button}`}
            >
              {t('product.buyNow')}
            </Link>
            <button
              onClick={handleAddToCart}
              className={`text-xs sm:text-sm py-1.5 px-2 bg-white border border-gray-200 rounded-lg text-gray-700 ${color.buttonHover}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              <span className="sr-only">{t('product.addToCart')}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
