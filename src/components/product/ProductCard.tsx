'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  
  // Log the image URL for debugging
  console.log(`ProductCard image URL for ${name}:`, image)
  
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
    console.log(`Lỗi tải hình ảnh cho ${name}: ${cleanImageUrl}`)
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
      className="group bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <div className="relative pt-[100%] bg-gray-100">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
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
          <button
            onClick={handleAddToCart}
            className="bg-white text-gray-800 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-full font-medium transition-colors"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col h-[160px]">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-10">{shortDescription}</p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-800">{formatCurrency(price)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            {weeklyPurchases > 0 && (
              <div className="text-xs text-gray-500 mb-1">
                <span className="text-green-600 font-medium">{weeklyPurchases}</span> lượt mua
              </div>
            )}
            {rating > 0 && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">{typeof rating === 'number' ? rating.toFixed(1) : Number(rating).toFixed(1)}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
} 