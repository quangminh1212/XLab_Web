'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Reset states when source changes
  useEffect(() => {
    setImageSrc(src)
    setLoading(true)
    setError(false)
  }, [src])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    console.error(`Lỗi khi tải ảnh: ${src}`)
    setError(true)
    setLoading(false)
  }

  // Kiểm tra xem URL hình ảnh là từ bên ngoài hay không
  const isExternalUrl = src && (src.startsWith('http://') || src.startsWith('https://'))

  // Fallback image khi có lỗi
  const fallbackImage = '/images/placeholder-product.jpg'

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${loading ? '' : 'hidden'}`}>
        <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
      
      {isExternalUrl ? (
        // Sử dụng thẻ img cho URL bên ngoài
        <img 
          src={error ? fallbackImage : imageSrc}
          alt={alt}
          className="h-full w-full object-contain"
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
        />
      ) : (
        // Sử dụng Next.js Image cho URL nội bộ
        <Image
          src={error ? fallbackImage : imageSrc}
          alt={alt}
          width={width || 300}
          height={height || 300}
          className="object-contain h-full w-full"
          onLoad={handleLoad}
          onError={handleError}
          priority={true}
          unoptimized={true}
        />
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500 mt-2">Không thể tải hình ảnh</p>
        </div>
      )}
    </div>
  )
} 