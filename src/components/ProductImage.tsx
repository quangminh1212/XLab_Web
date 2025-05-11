import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ProductImage({
  src,
  alt = 'Product Image',
  width = 500,
  height = 500,
  priority = false,
  className,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  onLoad,
  onError
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const placeholderImage = '/images/placeholder/product-placeholder.jpg';
  
  // Kiểm tra xem src có là một URL hợp lệ không
  const isValidSrc = (src?: string | null): boolean => {
    if (!src) return false;
    return src.startsWith('http') || src.startsWith('/') || src.startsWith('data:');
  };
  
  // Xử lý khi hình ảnh tải xong
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  // Xử lý khi hình ảnh gặp lỗi
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    if (onError) onError();
  };
  
  const imageSrc = isValidSrc(src) ? src : 
                  error ? placeholderImage : 
                  src || placeholderImage;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg bg-gray-100",
      isLoading ? "animate-pulse" : "",
      className
    )}>
      {fill ? (
        <Image
          src={imageSrc as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={cn(
            "object-cover transition-all duration-300",
            isLoading ? "scale-110 blur-sm" : "scale-100 blur-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          src={imageSrc as string}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          quality={quality}
          className={cn(
            "object-cover transition-all duration-300",
            isLoading ? "scale-110 blur-sm" : "scale-100 blur-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </div>
  );
} 