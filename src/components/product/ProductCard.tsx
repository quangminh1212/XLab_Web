'use client'

import React, { useState, memo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartContext'

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
  slug?: string
  onAddToCart?: (id: string) => void
  onView?: (id: string) => void
}

const ProductCard = memo(function ProductCard({
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
  const [showAddedEffect, setShowAddedEffect] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()
  
  // Log the image URL for debugging
  console.log(`ProductCard image URL for ${name}:`, image)
  
  // Determine the image URL with thorough validation
  const getValidImageUrl = (imgUrl: string | null | undefined): string => {
    if (!imgUrl) return '/images/placeholder/product-placeholder.jpg'
    if (imgUrl.startsWith('blob:')) return '/images/placeholder/product-placeholder.jpg'
    if (imgUrl.includes('undefined')) return '/images/placeholder/product-placeholder.jpg'
    if (imgUrl.trim() === '') return '/images/placeholder/product-placeholder.jpg'
    
    // Nếu đường dẫn không tồn tại hoặc không hợp lệ, sử dụng placeholder
    try {
      const url = new URL(imgUrl, window.location.origin);
      return url.toString();
    } catch (e) {
      // Nếu không phải URL đầy đủ, giữ nguyên giá trị
      return imgUrl;
    }
  }
  
  // Get the final image URL
  const cleanImageUrl = getValidImageUrl(image)
  
  // Sử dụng mô tả ngắn đã được truyền vào
  const shortDescription = description || ''
      
  // Calculate discount only if originalPrice is higher than price
  const discountPercentage = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0

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
    }).format(amount)
  }

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

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
              fill={i === fullStars && hasHalfStar ? `url(#halfGradient-${id}-${i})` : 'currentColor'}
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

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Thêm sản phẩm vào giỏ hàng trực tiếp từ component
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image: displayImageUrl
    })
    
    // Hiển thị hiệu ứng đã thêm vào giỏ
    setShowAddedEffect(true)
    setTimeout(() => {
      setShowAddedEffect(false)
    }, 1000)
    
    // Gọi callback nếu được cung cấp
    if (onAddToCart) {
      onAddToCart(id)
    }
  }, [id, name, price, displayImageUrl, addItem, onAddToCart])

  const handleView = useCallback(() => {
    if (onView) onView(id)
  }, [onView, id])

  // Handle image error and use placeholder
  const handleImageError = () => {
    console.log(`Lỗi tải hình ảnh cho ${name}: ${cleanImageUrl}`)
    setImageError(true)
    setIsImageLoaded(true) // Mark as loaded to hide spinner
  }

  // Tạo slug từ tên nếu không có slug được truyền vào
  const productSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <Link
      href={isAccount ? `/accounts/${id}` : `/products/${productSlug}`}
      className="group flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative pt-[100%] bg-white">
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
          className={`object-cover transition-all duration-500 ${
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

        {showAddedEffect && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 animate-fadeInOut">
            <div className="bg-white text-green-600 font-bold px-4 py-2 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Đã thêm
            </div>
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
              className="bg-white text-gray-800 hover:bg-primary-100 hover:text-primary-600 px-4 py-2 rounded-full font-medium transition-colors active:scale-95"
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e);
                router.push('/checkout?skipInfo=true');
              }}
              className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded-full font-medium text-center transition-colors active:scale-95"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        {category && (
          <div className="text-xs text-gray-500 mb-1">{category}</div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-1">
          {name}
        </h3>
        {shortDescription && (
          <div
            className="text-[0.525rem] font-light text-gray-500 line-clamp-2 mb-2"
            dangerouslySetInnerHTML={{ __html: shortDescription }}
          />
        )}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(price)}
              </span>
              {originalPrice && (
                <span className="ml-2 text-xs text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-1">
              {rating > 0 ? (
                renderRatingStars(rating)
              ) : (
                <div className="h-4"></div>
              )}
            </div>
          </div>
          {weeklyPurchases > 0 && (
            <div className="text-xs text-gray-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
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
              {weeklyPurchases}+
            </div>
          )}
        </div>
      </div>
    </Link>
  )
})

export default ProductCard 