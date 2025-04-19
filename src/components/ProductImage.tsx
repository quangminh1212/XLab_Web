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
  // Đảm bảo luôn có giá trị mặc định nếu src là null hoặc undefined
  const defaultSrc = '/images/placeholder-product.jpg'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src || defaultSrc)

  // Reset states when source changes
  useEffect(() => {
    setImageSrc(src || defaultSrc)
    setLoading(true)
    setError(false)
    
    // Đảm bảo tự động tắt loading sau 800ms
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timeout)
  }, [src])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    console.error(`Lỗi khi tải ảnh: ${src}`)
    setError(true)
    setLoading(false)
    setImageSrc(defaultSrc)
  }

  // Check if the image URL is external or not
  const isExternalUrl = imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {isExternalUrl ? (
        // Use img tag for external URLs
        <img 
          src={imageSrc}
          alt={alt || 'Product image'}
          className="h-full w-full object-contain"
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
        />
      ) : (
        // Use Next.js Image for internal URLs
        <div className="h-full w-full">
          <Image
            src={imageSrc}
            alt={alt || 'Product image'}
            width={width || 300}
            height={height || 300}
            className="object-contain h-full w-full"
            onLoad={handleLoad}
            onError={handleError}
            priority={true}
            unoptimized={true}
          />
        </div>
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