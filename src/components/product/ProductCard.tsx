'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { safeLog } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  description: string  // Thực tế là shortDescription
  price: number
  originalPrice?: number
  image: string
  category?: string
  rating?: number
  reviewCount?: number
  isAccount?: boolean
  weeklyPurchases?: number
  totalSales?: number
  downloadCount?: number
  slug?: string
  onAddToCart?: (id: string) => void
  onView?: (id: string) => void
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
  slug = '',
  onAddToCart = () => {},
  onView = () => {}
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  
  // Determine the image URL with thorough validation
  const getValidImageUrl = (imgUrl: string | null | undefined): string => {
    if (!imgUrl) return '/images/placeholder/product-placeholder.jpg'
    if (imgUrl.startsWith('blob:')) return '/images/placeholder/product-placeholder.jpg'
    if (imgUrl.includes('undefined')) return '/images/placeholder/product-placeholder.jpg'
    if (imgUrl.trim() === '') return '/images/placeholder/product-placeholder.jpg'
    return imgUrl
  }
  
  // Get the final image URL
  const cleanImageUrl = getValidImageUrl(image)
  
  // Sử dụng mô tả ngắn thay vì cắt mô tả dài
  const shortDescription = description
      
  // Calculate discount only if originalPrice is higher than price
  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

  // Giả sử có một hàm để định dạng giá tiền theo tiền tệ VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Hàm định dạng rating an toàn
  const formatRating = (rating: any): string => {
    // Đảm bảo rating là số
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating)
    // Kiểm tra nếu là số hợp lệ
    return !isNaN(numericRating) ? numericRating.toFixed(1) : '0.0'
  }

  const renderRatingStars = (rating: number) => {
    // Đảm bảo rating là số
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating)
    // Nếu không phải số hợp lệ, hiển thị 0 sao
    if (isNaN(numericRating)) return null
    
    const fullStars = Math.floor(numericRating)
    const hasHalfStar = numericRating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3 w-3 ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            {i === fullStars && hasHalfStar ? (
              <defs>
                <linearGradient id="halfGradient">
                  <stop offset="50%" stopColor="#FACC15" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
            ) : null}
            <path
              fill={i === fullStars && hasHalfStar ? 'url(#halfGradient)' : 'currentColor'}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
        {reviewCount > 0 && (
          <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
        )}
      </div>
    )
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onAddToCart) onAddToCart(id)
  }

  const handleView = () => {
    if (onView) onView(id)
  }

  // Handle image error and use placeholder
  const handleImageError = () => {
    safeLog.warn(`Lỗi tải hình ảnh cho ${name}: ${cleanImageUrl}`)
    setImageError(true)
    setIsImageLoaded(true) // Mark as loaded to hide spinner
  }

  // Tạo slug từ tên nếu không có slug được truyền vào
  const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // The actual image to display (with fallback)
  const displayImageUrl = imageError 
    ? '/images/placeholder/product-placeholder.jpg' 
    : cleanImageUrl;

  return (
    <Link
      href={isAccount ? `/accounts/${id}` : `/products/${productSlug}`}
      className="group bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative pt-[100%] bg-white w-full">
        {originalPrice && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}

        <Image
          src={displayImageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-contain transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          priority={false}
          onError={handleImageError}
        />

        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <svg
              className="w-10 h-10 text-gray-300 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
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

        <div
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-800 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(isAccount ? `/accounts/${id}` : `/products/${productSlug}`);
              }}
              className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-full font-medium transition-colors"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-grow">
        {category && (
          <div className="text-xs text-gray-500 mb-1">{category}</div>
        )}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] mb-1">
          {name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[2rem] flex-grow">
          {shortDescription}
        </p>
        
        {/* Phần đánh giá */}
        <div className="flex items-center justify-between mb-1">
          <div>
            {/* Phần giá */}
            <div className="flex items-center">
              <span className="text-base font-semibold text-primary-600">
                {formatCurrency(price)}
              </span>
              {originalPrice && discountPercentage > 0 && (
                <span className="ml-2 text-xs text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {rating > 0 && (
              <div className="flex items-center">
                <span className="bg-yellow-50 text-xs font-medium text-yellow-600 px-1.5 py-0.5 rounded mr-1">{formatRating(rating)}</span>
                {renderRatingStars(rating)}
              </div>
            )}
          </div>
        </div>
        
        {/* Phần đã bán */}
        {weeklyPurchases > 0 && (
          <div className="flex justify-end mb-3">
            <div className="text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Đã bán: {weeklyPurchases}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
} 