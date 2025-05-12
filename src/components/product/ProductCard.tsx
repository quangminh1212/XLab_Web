'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category?: string
  rating?: number
  reviewCount?: number
  onAddToCart?: (id: string) => void
  onView?: (id: string) => void
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  onAddToCart,
  onView,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

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

  return (
    <div className="relative overflow-hidden rounded-lg bg-white hover:shadow-md transition-all h-full flex flex-col">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image || '/images/placeholder/product-placeholder.jpg'}
            alt={name}
            width={300}
            height={300}
            className="object-cover w-full h-full transition-transform hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder/product-placeholder.jpg';
            }}
          />
          {originalPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-800">{formatCurrency(price)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            {rating > 0 && renderRatingStars(rating)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard 