'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-5 h-5 sm:w-6 sm:h-6',
  sm: 'w-6 h-6 sm:w-8 sm:h-8',
  md: 'w-8 h-8 sm:w-10 sm:h-10', 
  lg: 'w-10 h-10 sm:w-12 sm:h-12',
  xl: 'w-12 h-12 sm:w-16 sm:h-16',
  '2xl': 'w-16 h-16 sm:w-24 sm:h-24'
};

const sizePixels = {
  xs: { width: 20, height: 20 },
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 40, height: 40 },
  xl: { width: 48, height: 48 },
  '2xl': { width: 64, height: 64 }
};

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const { width, height } = sizePixels[size];
  
  const handleImageError = () => {
    console.log('Avatar image failed to load:', src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // Determine which image to show
  const imageSrc = !imageError && src ? src : '/images/avatar-placeholder.svg';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="rounded-full object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true}
      />
    </div>
  );
};

export default Avatar; 