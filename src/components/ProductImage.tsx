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

  useEffect(() => {
    setImageSrc(src)
    setLoading(true)
    setError(false)
  }, [src])

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} object-cover`}
          onLoad={handleLoad}
          onError={handleError}
          priority={true}
        />
      )}
    </div>
  )
} 