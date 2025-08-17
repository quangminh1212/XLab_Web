'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface ProductImageProps {
  images: string[] | undefined;
  name: string;
  aspectRatio?: string;
}

const ProductImage = ({ images, name, aspectRatio = 'square' }: ProductImageProps) => {
  // Validate and normalize image URLs
  const validateImageUrl = (url: string): string => {
    const placeholder = '/images/placeholder/product-placeholder.jpg';
    if (!url) return placeholder;
    const fixed = url.replace(/\\/g, '/');
    if (fixed.startsWith('blob:')) return placeholder;
    if (fixed.includes('undefined')) return placeholder;
    if (fixed.trim() === '') return placeholder;
    return fixed;
  };

  // Process the image array
  const processedImages = images?.map(validateImageUrl) || [
    '/images/placeholder/product-placeholder.jpg',
  ];

  const [mainImage, setMainImage] = useState(processedImages[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageFailed, setImageFailed] = useState(false);

  // Update main image when images prop changes
  useEffect(() => {
    if (processedImages.length > 0) {
      setMainImage(processedImages[0]);
      setSelectedIndex(0);
      setIsLoading(true);
      setImageFailed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedImages?.[0]]);

  // Fallback array if images is undefined
  const imageArray = processedImages.length
    ? processedImages
    : ['/images/placeholder/product-placeholder.jpg'];

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setSelectedIndex(index);
    setIsLoading(true);
    setImageFailed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Handle image error
  const handleImageError = () => {
    // image load error for: mainImage
    setImageFailed(true);
    setIsLoading(false);
  };

  // Pick aspect ratio classes based on the prop
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'pt-[100%]'; // 1:1
      case 'landscape':
        return 'pt-[75%]'; // 4:3
      case 'portrait':
        return 'pt-[133.33%]'; // 3:4
      case 'widescreen':
        return 'pt-[56.25%]'; // 16:9
      default:
        return 'pt-[100%]'; // Default to square
    }
  };

  // Determine which image to show
  const displayImage: string = (imageFailed ? '/images/placeholder/product-placeholder.jpg' : mainImage) || '/images/placeholder/product-placeholder.jpg';

  return (
    <div className="w-full">
      {/* Main Image */}
      <div
        className={`relative ${getAspectRatioClass()} mb-3 bg-white border border-gray-200 rounded-lg overflow-hidden`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0">
          <Image
            src={displayImage}
            alt={name}
            fill
            unoptimized
            className={`object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoadingComplete={() => setIsLoading(false)}
            onError={handleImageError}
            style={{
              transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
              transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
              transition: isZoomed ? 'none' : 'transform 0.3s ease',
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Zoom instruction */}
        <div className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-50 text-white py-1 px-2 rounded">
          Di chuột để phóng to
        </div>
      </div>

      {/* Thumbnails row */}
      {imageArray.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {imageArray.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(image, index)}
              className={`relative w-16 h-16 flex-shrink-0 border-2 rounded overflow-hidden focus:outline-none ${
                selectedIndex === index ? 'border-blue-500' : 'border-gray-200'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${name} - thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
                onError={(e) => {
                  console.error(`Không thể tải thumbnail: ${image}`);
                  // Replace with placeholder image
                  (e.target as HTMLImageElement).src =
                    '/images/placeholder/product-placeholder.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
