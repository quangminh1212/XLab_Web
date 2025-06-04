'use client';

import React from 'react';
import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image src={src} alt={alt} fill className="object-contain" />
    </div>
  );
};

export default ProductImage;
