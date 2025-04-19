'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

// Biểu tượng mặc định SVG cho VoiceTyping
const DefaultVoiceTypingIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#f0f9f8" />
    <circle cx="100" cy="100" r="70" fill="#e6f7f5" />
    <path d="M100 125C111.66 125 120 116.66 120 105V55C120 43.34 111.66 35 100 35C88.34 35 80 43.34 80 55V105C80 116.66 88.34 125 100 125Z" 
      fill="#00a896" stroke="#008075" strokeWidth="3" />
    <path d="M145 90C145 110.76 129.02 128.06 107.4 134.78V165H92.6V134.78C70.98 128.06 55 110.76 55 90H70C70 107.21 83.79 120 100 120H110C126.21 120 140 107.21 140 90H145Z" 
      fill="#00a896" stroke="#008075" strokeWidth="3" />
    <path d="M135 75C135 75 142 85 142 100C142 115 135 125 135 125" stroke="#00a896" strokeWidth="5" strokeLinecap="round" />
    <path d="M65 75C65 75 58 85 58 100C58 115 65 125 65 125" stroke="#00a896" strokeWidth="5" strokeLinecap="round" />
  </svg>
)

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

  // Xác định nếu đây là ảnh VoiceTyping
  const isVoiceTyping = src.includes('voice') || src.includes('typing')

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Hiển thị placeholder trong khi đang tải */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg className="w-10 h-10 text-primary-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Hiển thị biểu tượng SVG mặc định nếu có lỗi và đây là VoiceTyping */}
      {isError && isVoiceTyping ? (
        <div className="w-full h-full">
          <DefaultVoiceTypingIcon />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          priority={priority}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => setIsError(true)}
          unoptimized={true}
        />
      )}
    </div>
  )
} 