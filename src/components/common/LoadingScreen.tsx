'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingScreenProps {
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  fullScreen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading = true,
  size = 'md',
  withText = true,
  fullScreen = false,
  className = '',
  children,
}) => {
  const { t } = useLanguage();
  
  const sizeMap = {
    sm: {
      container: 'w-8 h-8',
      subtitle: 'text-xs mt-2'
    },
    md: {
      container: 'w-12 h-12',
      subtitle: 'text-sm mt-3'
    },
    lg: {
      container: 'w-16 h-16',
      subtitle: 'text-base mt-4'
    }
  };
  
  const currentSize = sizeMap[size];

  return (
    <>
      {isLoading && (
        <div
          className={`flex flex-col items-center justify-center ${
            fullScreen ? 'fixed inset-0 z-50 bg-white bg-opacity-90' : className
          }`}
        >
          <div className={`${currentSize.container} relative`}>
            <div className="spinner absolute inset-0 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          {withText && (
            <p className={`${currentSize.subtitle} text-gray-500`}>{t('loading.pleaseWait')}</p>
          )}
        </div>
      )}
      {!isLoading && children}
    </>
  );
};

export default LoadingScreen;
