'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency, convertCurrency } from '@/shared/utils/formatCurrency';

interface ProductCardProps {
  id: string;
  name: string;
  description: string; // Mô tả ngắn của sản phẩm
  price: number;
  originalPrice?: number;
  image: string;
  category?: string | object;
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
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAddedEffect, setShowAddedEffect] = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState<string>(description);
  const [translatedName, setTranslatedName] = useState<string>(name);
  const router = useRouter();
  const { addItem, clearCart } = useCart();

  // Log the image URL for debugging
  console.log(`ProductCard image URL for ${name}:`, image);

  // Xử lý dịch mô tả ngắn và tên sản phẩm khi ngôn ngữ thay đổi
  useEffect(() => {
    // Nếu có mã định danh sản phẩm đặc biệt (chatgpt, grok), sử dụng bản dịch từ file
    if (id === 'chatgpt' || id === 'grok') {
      const translationKey = `product.products.${id}.shortDescription`;
      const translation = t(translationKey);
      console.log(`Looking up translation for ${translationKey}:`, translation);
      setTranslatedDescription(translation || description);
      setTranslatedName(name); // Giữ nguyên tên
    } 
    // Lấy bản dịch nếu đang ở chế độ tiếng Anh
    else if (language === 'eng') {
      const fetchTranslation = async () => {
        try {
          const response = await fetch('/api/product-translations?id=' + id + '&lang=' + language);
          if (response.ok) {
            const data = await response.json();
            console.log(`ProductCard translation data for ${id}:`, data);
            // Cập nhật mô tả ngắn đã dịch
            if (data && data.shortDescription) {
              setTranslatedDescription(data.shortDescription);
            } else {
              setTranslatedDescription(description); // Fallback to original if no translation
            }
            
            // Cập nhật tên sản phẩm đã dịch
            if (data && data.name) {
              setTranslatedName(data.name);
            } else {
              setTranslatedName(name); // Fallback to original if no translation
            }
          } else {
            setTranslatedDescription(description); // Fallback to original
            setTranslatedName(name);
          }
        } catch (error) {
          console.error('Error fetching translation:', error);
          setTranslatedDescription(description); // Fallback to original
          setTranslatedName(name);
        }
      };

      fetchTranslation();
    } else {
      // Nếu tiếng Việt, sử dụng mô tả và tên gốc
      setTranslatedDescription(description);
      setTranslatedName(name);
    }
  }, [description, name, language, id, t]);

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

  // Sử dụng mô tả đã được dịch
  // Giới hạn độ dài của mô tả để đảm bảo hiển thị đúng
  const shortDescription = (translatedDescription || '').substring(0, 100) + (translatedDescription && translatedDescription.length > 100 ? '...' : '');

  // Calculate discount only if originalPrice is higher than price
  const discountPercentage =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // The actual image to display (with fallback) - moved up for use in handleAddToCart
  const displayImageUrl = imageError
    ? '/images/placeholder/product-placeholder.jpg'
    : cleanImageUrl;

  // Xử lý category có thể là object phức tạp
  const getCategoryName = (categoryValue: string | object | undefined): string => {
    if (!categoryValue) return "";
    
    if (typeof categoryValue === 'string') {
      return categoryValue;
    }
    
    if (typeof categoryValue === 'object') {
      // Nếu là object, thử lấy thuộc tính name hoặc id
      const categoryObj = categoryValue as any;
      
      if (categoryObj.name) {
        // Nếu có thuộc tính name
        if (typeof categoryObj.name === 'string') {
          return categoryObj.name;
        } else if (typeof categoryObj.name === 'object' && categoryObj.name.id) {
          return String(categoryObj.name.id);
        }
      }
      
      if (categoryObj.id) {
        // Nếu có thuộc tính id
        if (typeof categoryObj.id === 'string') {
          return categoryObj.id;
        } else if (typeof categoryObj.id === 'object' && categoryObj.id.id) {
          return String(categoryObj.id.id);
        }
      }
    }
    
    return ""; // Return empty string instead of undefined
  };

  // Lấy tên category để hiển thị
  const displayCategory = getCategoryName(category);

  // Format currency based on selected language
  const displayPrice = (amount: number) => {
    // Convert to appropriate currency based on language
    const convertedAmount = convertCurrency(amount, language);
    // Format with the correct currency symbol and format
    return formatCurrency(convertedAmount, language);
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
            className={`h-2 w-2 ${
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
        {reviewCount > 0 && <span className="ml-1 text-[8px] text-gray-500">({reviewCount})</span>}
      </div>
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Thêm sản phẩm vào giỏ hàng trực tiếp từ component
    addItem({
      id,
      name: translatedName,
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
    {
      name: 'indigo',
      bg: 'from-white via-indigo-50 to-indigo-100',
      hover: 'hover:border-indigo-300 hover:shadow-indigo-100/50',
      badge: 'from-indigo-500 to-indigo-600',
      button: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      buttonHover: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300',
      price: 'from-indigo-600 to-indigo-700',
      stats: 'text-indigo-600',
      statsIcon: 'text-indigo-500',
      overlay: 'to-indigo-900/40',
    },
  ];

  // Chọn màu dựa trên ID sản phẩm để đảm bảo consistent
  const safeId = id || '0';
  const parsedId = parseInt(safeId);
  const colorIndex = isNaN(parsedId) ? 0 : Math.abs(parsedId) % colorPalette.length;
  const currentColor = colorPalette[colorIndex] || colorPalette[0];

  return (
    <Link
      href={isAccount ? `/services/${id}` : `/products/${productSlug}`}
      className={`group flex flex-col h-full w-full bg-gradient-to-br ${currentColor.bg} rounded-xl border border-gray-200/60 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 hover:scale-[1.02] ${currentColor.hover} relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%] bg-white">
        {originalPrice && discountPercentage > 0 && (
          <div
            className={`absolute top-2 left-2 z-10 bg-gradient-to-r ${currentColor.badge} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-black/20 animate-pulse hover:animate-none hover:scale-110 transition-transform duration-200 border border-white/20`}
          >
            -{discountPercentage}%
          </div>
        )}

        <Image
          src={displayImageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-contain transition-all duration-500 scale-100 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          priority={false}
          onError={handleImageError}
        />

        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {showAddedEffect && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 ${currentColor.overlay} z-20 animate-fadeInOut`}
          >
            <div
              className={`bg-gradient-to-r ${currentColor.badge} text-white font-bold px-3 py-1 rounded-full flex items-center shadow-lg text-xs`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t('product.added')}
            </div>
          </div>
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-br from-black/40 via-gray-900/30 to-primary-900/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={handleAddToCart}
              className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 border border-white/50 px-3 py-1.5 rounded-full font-semibold transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl hover:scale-105 transform text-xs"
            >
              <span className="flex items-center justify-center">
                <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 7m0 6l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                {t('product.addToCart')}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Clear cart and add only this product
                clearCart();
                addItem({
                  id,
                  name: translatedName,
                  price,
                  quantity: 1,
                  image,
                  version: '',
                  uniqueKey: `${id}_default_`,
                });
                router.push('/checkout?skipInfo=true');
              }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-3 py-1.5 rounded-full font-bold text-center transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl hover:scale-105 transform border border-white/20 text-xs"
            >
              <span className="flex items-center justify-center">
                <svg className="w-2 h-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {t('product.buyNow')}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 flex-1 flex flex-col bg-white">
        {displayCategory && (
          <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            {displayCategory}
          </div>
        )}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-gray-700 transition-colors duration-200">
          {translatedName}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2 mb-5 leading-relaxed">
          {shortDescription}
        </p>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex-1">
            <div className="flex items-baseline flex-wrap gap-2 mb-2">
              <span
                className={`text-base font-extrabold bg-gradient-to-r ${currentColor.price} bg-clip-text text-transparent`}
              >
                {displayPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  {displayPrice(originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-1">{rating > 0 ? renderRatingStars(rating) : <div className="h-2"></div>}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {weeklyPurchases > 0 && (
              <div
                className={`text-[10px] ${currentColor.stats} flex items-center px-2 py-1 rounded-full bg-white shadow-sm`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-2.5 w-2.5 mr-1.5 ${currentColor.statsIcon}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="font-semibold">{t('product.purchasesPerWeek', { count: weeklyPurchases })}</span>
              </div>
            )}
            {totalSold > 0 && (
              <div
                className={`text-[10px] ${currentColor.stats} flex items-center px-2 py-1 rounded-full bg-white shadow-sm`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-2.5 w-2.5 mr-1.5 ${currentColor.statsIcon}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="font-semibold">{t('product.totalSold', { count: totalSold })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
