'use client'

import Image from 'next/image'
import { useState } from 'react'

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
  const [imgSrc, setImgSrc] = useState(src)

  // Xử lý lỗi khi ảnh không tải được
  const handleError = () => {
    setImgSrc('/placeholder-product.jpg')
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={true}
    />
  )
} 