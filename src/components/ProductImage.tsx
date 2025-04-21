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

// Biểu tượng cho CapCut
const CapCutIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#111111" />
    <circle cx="100" cy="100" r="75" fill="#22C5FF" />
    <path d="M100 145C75 145 55 125 55 100C55 75 75 55 100 55C125 55 145 75 145 100V120L105 80C95 70 85 70 75 80L100 145Z" fill="#2DFF6A" />
    <path d="M100 145L75 80C85 70 95 70 105 80L145 120V100C145 75 125 55 100 55" fill="#FF3863" />
  </svg>
)

// Biểu tượng cho ChatGPT
const ChatGPTIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="100" fill="#10A37F" />
    <path d="M75 100L90 115L125 80" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Biểu tượng cho Adobe CC
const AdobeIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="10" fill="#FA0F00" />
    <path d="M79 54H48V146L79 54Z" fill="white" />
    <path d="M121 54H152V146L121 54Z" fill="white" />
    <rect x="89" y="104" width="22" height="42" fill="white" />
  </svg>
)

// Biểu tượng cho Canva
const CanvaIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#00C4CC" />
    <circle cx="75" cy="81" r="16" fill="white" />
    <circle cx="125" cy="81" r="16" fill="white" />
    <circle cx="100" cy="119" r="16" fill="white" />
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
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  
  const handleError = () => {
    console.error(`Failed to load image: ${src}`)
    setIsError(true)
    setIsLoading(false)
  }
  
  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Xác định loại sản phẩm dựa trên đường dẫn ảnh
  const isVoiceTyping = src.includes('voice') || src.includes('typing')
  const isCapCut = src.includes('capcut')
  const isChatGPT = src.includes('chatgpt')
  const isAdobe = src.includes('adobe')
  const isCanva = src.includes('canva')

  // Hiển thị icon phù hợp thay vì tải ảnh nếu là một trong các loại đặc biệt
  const renderAppIcon = () => {
    if (isVoiceTyping) return <DefaultVoiceTypingIcon />
    if (isCapCut) return <CapCutIcon />
    if (isChatGPT) return <ChatGPTIcon />
    if (isAdobe) return <AdobeIcon />
    if (isCanva) return <CanvaIcon />
    
    // Nếu không phải loại đặc biệt, tải ảnh bình thường
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        unoptimized={true}
      />
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Hiển thị trạng thái loading */}
      {isLoading && !(isVoiceTyping || isCapCut || isChatGPT || isAdobe || isCanva) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Hiển thị ảnh hoặc fallback khi có lỗi */}
      {isError && !(isVoiceTyping || isCapCut || isChatGPT || isAdobe || isCanva) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Không thể tải ảnh</p>
        </div>
      ) : (
        renderAppIcon()
      )}
    </div>
  )
} 