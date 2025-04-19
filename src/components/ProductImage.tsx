'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
}) => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Danh sách ảnh dự phòng theo thứ tự ưu tiên
  const fallbackImages = [
    '/images/placeholder-product.jpg',
    '/placeholder-product.jpg',
    '/images/categories/productivity.png',
  ]

  // Tìm ảnh dự phòng đầu tiên không trùng với src
  const fallbackSrc = fallbackImages.find(img => img !== src) || fallbackImages[0]

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Hiển thị placeholder trong khi đang tải */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg className="w-8 h-8 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      <Image
        src={isError ? fallbackSrc : src}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsError(true)
          setIsLoading(false)
        }}
      />
    </div>
  )
} 