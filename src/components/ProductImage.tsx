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
  // Màu xanh của XLab
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjhmZiIvPjxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iODAiIGZpbGw9IiMwMDc0ZDkiIGZpbGwtb3BhY2l0eT0iMC44Ii8+PHRleHQgeD0iNDAwIiB5PSIzODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPlhMYWI8L3RleHQ+PC9zdmc+'
  const [imgSrc, setImgSrc] = useState<string>(src || defaultImage)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  
  // Cập nhật imgSrc khi src prop thay đổi và đặt loading timeout
  useEffect(() => {
    if (src && src !== '/placeholder-product.jpg') {
      setImgSrc(src)
      setIsError(false)
    } else {
      setImgSrc(defaultImage)
    }
    setIsLoading(true)
    
    // Tự động chuyển loading state sau 1.5 giây để tránh spinner vô hạn
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    
    return () => clearTimeout(loadingTimeout)
  }, [src])

  // Xử lý lỗi khi ảnh không tải được
  const handleError = () => {
    console.log('Ảnh không tải được:', imgSrc)
    setImgSrc(defaultImage)
    setIsLoading(false)
    setIsError(true)
  }
  
  // Xử lý khi ảnh tải thành công
  const handleLoad = () => {
    setIsLoading(false)
    setIsError(false)
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