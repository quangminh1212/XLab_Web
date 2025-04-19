'use client'

import React from 'react'
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
  // Sử dụng ảnh placeholder mặc định nếu không có src
  const imageSrc = src || '/images/placeholder-product.jpg'
  const imageAlt = alt || 'Product image'

  // Kiểm tra nếu là URL bên ngoài (http/https)
  const isExternalUrl = imageSrc && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://'))

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {isExternalUrl ? (
        // Dùng thẻ img cho URL bên ngoài
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-contain"
          loading="eager"
          onError={(e) => {
            // Đặt src thành ảnh placeholder nếu có lỗi
            e.currentTarget.src = '/images/placeholder-product.jpg'
          }}
        />
      ) : (
        // Dùng Next.js Image cho URL nội bộ
        <div className="h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={width || 300}
            height={height || 300}
            className="object-contain h-full w-full"
            priority={true}
            unoptimized={true}
            onError={() => {
              console.error(`Lỗi khi tải ảnh: ${src}`)
            }}
          />
        </div>
      )}
    </div>
  )
} 