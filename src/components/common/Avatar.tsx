'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-24 h-24'
};

const sizePixels = {
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 96, height: 96 }
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
    <div className={`${sizeClasses[size]} ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="rounded-full object-cover w-full h-full"
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true}
      />
    </div>
  );
};

export default Avatar; 