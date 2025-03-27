'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

type ProductImageProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function ProductImage({
  src,
  alt,
  width,
  height,
  className = '',
}: ProductImageProps) {
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2NjY2NjYyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5YTGFiIFByb2R1Y3Q8L3RleHQ+PC9zdmc+'
  const [imgSrc, setImgSrc] = useState<string>(defaultImage)
  const [isLoading, setIsLoading] = useState(true)
  
  // Cập nhật imgSrc khi src prop thay đổi
  useEffect(() => {
    if (src && src !== '/placeholder-product.jpg') {
      setImgSrc(src)
    } else {
      setImgSrc(defaultImage)
    }
    setIsLoading(true)
  }, [src])

  // Xử lý lỗi khi ảnh không tải được
  const handleError = () => {
    console.log('Ảnh không tải được:', imgSrc)
    setImgSrc(defaultImage)
    setIsLoading(false)
  }
  
  // Xử lý khi ảnh tải thành công
  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt || 'Product image'}
        width={width || 300}
        height={height || 300}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        priority={true}
        unoptimized={true}
      />
    </div>
  )
} 