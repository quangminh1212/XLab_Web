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
  
  // Tạo URL chính xác cho hình ảnh
  const getValidImageUrl = (url: string): string => {
    if (!url || url === '/placeholder-product.jpg') {
      return url
    }
    
    // Chuyển đổi đường dẫn từ SVG sang PNG
    let validUrl = url
    
    // Đảm bảo đường dẫn /images/product/ có file .png
    if (url.includes('products/') || url.includes('categories/')) {
      // Loại bỏ đuôi SVG nếu có
      validUrl = url.replace('.svg', '.png')
      
      // Đảm bảo sử dụng các file PNG có sẵn
      if (validUrl.includes('business.svg') || validUrl.includes('business.png')) {
        validUrl = '/images/categories/productivity.png'
      }
    }
    
    return validUrl
  }
  
  // Cập nhật imgSrc khi src prop thay đổi
  useEffect(() => {
    const validImageUrl = getValidImageUrl(src)
    setImgSrc(validImageUrl)
    setIsLoading(true)
    
    return () => {}
  }, [src])

  // Xử lý lỗi khi ảnh không tải được
  const handleError = () => {
    console.log('Ảnh không tải được:', imgSrc)
    // Không đổi imgSrc để hiển thị loading thay vì placeholder
    setIsError(true)
    // Giữ trạng thái loading khi có lỗi
    setIsLoading(true)
  }
  
  // Xử lý khi ảnh tải thành công
  const handleLoad = () => {
    setIsLoading(false)
    setIsError(false)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {!isError && (
        <Image
          src={imgSrc}
          alt={alt || 'Product image'}
          width={width || 300}
          height={height || 300}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 object-contain px-4 py-2`}
          onError={handleError}
          onLoad={handleLoad}
          priority={true}
          unoptimized={true}
        />
      )}
    </div>
  )
} 