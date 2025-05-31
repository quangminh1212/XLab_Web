'use client';

import React from 'react';

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

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}) => {
  console.log('🔍 Avatar render - src:', src);

  // If we have a valid source, use background-image
  if (src && src.trim() !== '') {
    return (
      <div 
        className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-full bg-gray-100`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        title={alt}
      />
    );
  }

  // Fallback to placeholder
  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-full bg-gray-100 flex items-center justify-center`}>
      <svg 
        className="w-2/3 h-2/3 text-gray-400" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
  );
};

export default Avatar; 