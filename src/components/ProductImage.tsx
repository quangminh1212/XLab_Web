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
  const defaultImage = '/placeholder-product.jpg'
  const [imgSrc, setImgSrc] = useState<string>(defaultImage)
  
  // Cập nhật imgSrc khi src prop thay đổi
  useEffect(() => {
    if (src) {
      setImgSrc(src)
    } else {
      setImgSrc(defaultImage)
    }
  }, [src])

  // Xử lý lỗi khi ảnh không tải được
  const handleError = () => {
    if (imgSrc !== defaultImage) {
      setImgSrc(defaultImage)
    }
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Product image'}
      width={width || 300}
      height={height || 300}
      className={className}
      onError={handleError}
      priority={true}
      unoptimized={true}
    />
  )
} 