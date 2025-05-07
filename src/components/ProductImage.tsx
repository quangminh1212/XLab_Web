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

// Biểu tượng cho CapCut/VideoEditor
const VideoEditorIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#000000" />
    <circle cx="100" cy="100" r="80" fill="#00CCFF" />
    <path d="M120 180C40 140 40 40 120 80L160 120V90C160 50 140 25 100 25C60 25 40 50 40 90C40 130 60 155 100 155" fill="#00FF66" />
    <path d="M120 80L160 120V90C160 50 140 25 100 25" fill="#FF3366" />
  </svg>
)

// Biểu tượng cho ChatGPT/SmartAI
const AIAssistantIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="100" fill="#10A37F" />
    <path d="M70 100L95 125L130 75" stroke="white" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Biểu tượng cho Adobe CC/DesignStudio
const DesignIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="#FA0F00" />
    <path d="M70 50H45V150L85 50H70Z" fill="white" />
    <path d="M130 50H155V150L115 50H130Z" fill="white" />
    <rect x="85" y="100" width="30" height="50" fill="white" />
  </svg>
)

// Biểu tượng cho SecureGuard Pro
const SecurityIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#2C3E50" />
    <path d="M100 40L40 60V110C40 135.7 65.9 160.4 100 170C134.1 160.4 160 135.7 160 110V60L100 40Z" fill="#3498DB" stroke="#FFFFFF" strokeWidth="5"/>
    <path d="M90 110L80 100L70 110L90 130L130 90L120 80L90 110Z" fill="#FFFFFF"/>
  </svg>
)

// Biểu tượng cho LearnCode Academy
const EducationIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="20" fill="#F39C12" />
    <path d="M30 80L100 50L170 80L100 110L30 80Z" fill="#FFFFFF" stroke="#E67E22" strokeWidth="3"/>
    <path d="M60 100V130C60 130 80 150 100 150C120 150 140 130 140 130V100" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
    <path d="M170 80V120" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="170" cy="130" r="10" fill="#E67E22" stroke="#FFFFFF" strokeWidth="3"/>
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

  // Xác định loại sản phẩm dựa trên đường dẫn ảnh hoặc alt text
  const sourceLower = (src + ' ' + alt).toLowerCase()
  
  const isVoiceTyping = sourceLower.includes('voice') || sourceLower.includes('typing')
  const isVideoEditor = sourceLower.includes('capcut') || sourceLower.includes('videoeditor') || sourceLower.includes('video editor')
  const isAIAssistant = sourceLower.includes('chatgpt') || sourceLower.includes('smartai') || sourceLower.includes('ai assistant')
  const isDesignStudio = sourceLower.includes('adobe') || sourceLower.includes('design') || sourceLower.includes('designstudio')
  const isSecurity = sourceLower.includes('secure') || sourceLower.includes('security') || sourceLower.includes('antivirus')
  const isEducation = sourceLower.includes('learn') || sourceLower.includes('education') || sourceLower.includes('academy')
  const isCanva = sourceLower.includes('canva')

  // Hiển thị icon phù hợp thay vì tải ảnh nếu là một trong các loại đặc biệt
  const renderAppIcon = () => {
    if (isVoiceTyping) return <DefaultVoiceTypingIcon />
    if (isVideoEditor) return <VideoEditorIcon />
    if (isAIAssistant) return <AIAssistantIcon />
    if (isDesignStudio) return <DesignIcon />
    if (isSecurity) return <SecurityIcon />
    if (isEducation) return <EducationIcon />
    if (isCanva) return <CanvaIcon />
    
    // Nếu không phải loại đặc biệt, tải ảnh bình thường
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain max-w-full max-h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        onLoad={handleLoadingComplete}
        onError={handleError}
        unoptimized={true}
      />
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Hiển thị trạng thái loading */}
      {isLoading && !(isVoiceTyping || isVideoEditor || isAIAssistant || isDesignStudio || isSecurity || isEducation || isCanva) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Hiển thị ảnh hoặc fallback khi có lỗi */}
      {isError && !(isVoiceTyping || isVideoEditor || isAIAssistant || isDesignStudio || isSecurity || isEducation || isCanva) ? (
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