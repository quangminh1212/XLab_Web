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
    <rect width="200" height="200" rx="20" fill="#1E1E1E" />
    <rect x="40" y="40" width="120" height="120" rx="60" fill="#22C5FF" />
    <path d="M140 90C140 118.66 116.66 142 88 142C76.03 142 65.03 137.97 56.46 131.05L102.86 84.65C110.65 76.86 123.14 76.86 130.93 84.65L140 93.72V90Z" fill="#FF3863" />
    <path d="M56.46 131.05C47.55 123.83 42 112.49 42 100C42 71.34 65.34 48 94 48C106.11 48 117.14 52.09 125.73 59.12L79.07 105.78C71.28 113.57 71.28 126.06 79.07 133.85L88.14 142.92C87.43 142.97 86.72 143 86 143C74.03 143 63.03 138.97 54.46 132.05L56.46 131.05Z" fill="#2DFF6A" />
  </svg>
)

// Biểu tượng cho ChatGPT
const ChatGPTIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#F7F7F7" />
    <circle cx="100" cy="100" r="60" fill="#10A37F" />
    <path d="M86.32 119.44H114.03V113.26H94.69V87.15H86.32V119.44Z" fill="white" />
    <path d="M124.22 119.44H132.57V87.15H124.22V119.44Z" fill="white" />
    <path d="M67.43 119.44H75.78V106.14L66.41 87.15H57.86L67.43 106.14V119.44Z" fill="white" />
  </svg>
)

// Biểu tượng cho Adobe CC
const AdobeIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#F5F5F5" />
    <rect x="40" y="40" width="120" height="120" rx="10" fill="#FF0000" />
    <path d="M68 114.5V60H98L68 114.5Z" fill="white" />
    <path d="M132 114.5V60H102L132 114.5Z" fill="white" />
    <rect x="87" y="95" width="26" height="20" fill="white" />
  </svg>
)

// Biểu tượng cho Canva
const CanvaIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#F9F9F9" />
    <rect x="40" y="40" width="120" height="120" rx="10" fill="#00C4CC" />
    <path d="M75.94 71.41C70.77 71.41 66.55 75.62 66.55 80.79C66.55 85.96 70.77 90.17 75.94 90.17C81.11 90.17 85.32 85.96 85.32 80.79C85.32 75.62 81.11 71.41 75.94 71.41Z" fill="white" />
    <path d="M124.06 71.41C118.89 71.41 114.68 75.62 114.68 80.79C114.68 85.96 118.89 90.17 124.06 90.17C129.23 90.17 133.45 85.96 133.45 80.79C133.45 75.62 129.23 71.41 124.06 71.41Z" fill="white" />
    <path d="M100 109.83C94.83 109.83 90.62 114.04 90.62 119.21C90.62 124.38 94.83 128.59 100 128.59C105.17 128.59 109.38 124.38 109.38 119.21C109.38 114.04 105.17 109.83 100 109.83Z" fill="white" />
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