'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  size = 'md',
}) => {
  const { t } = useLanguage();
  const defaultMessage = t('common.loading.data');
  const displayMessage = message || defaultMessage;

  const sizeClasses = {
    sm: {
      container: 'max-w-xs',
      spinner: 'w-10 h-10 sm:w-12 sm:h-12',
      bgCircle: 'w-10 h-10 sm:w-12 sm:h-12',
      title: 'text-base sm:text-lg',
      subtitle: 'text-xs sm:text-sm',
      progress: 'h-1 sm:h-1.5',
    },
    md: {
      container: 'max-w-sm sm:max-w-md',
      spinner: 'w-12 h-12 sm:w-16 sm:h-16',
      bgCircle: 'w-12 h-12 sm:w-16 sm:h-16',
      title: 'text-lg sm:text-xl',
      subtitle: 'text-sm sm:text-base',
      progress: 'h-1.5 sm:h-2',
    },
    lg: {
      container: 'max-w-md sm:max-w-lg',
      spinner: 'w-16 h-16 sm:w-20 sm:h-20',
      bgCircle: 'w-16 h-16 sm:w-20 sm:h-20',
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-base sm:text-lg',
      progress: 'h-2 sm:h-2.5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div
        className={`text-center p-4 sm:p-6 rounded-xl shadow-lg bg-white border border-gray-100 ${currentSize.container} w-full mx-4`}
      >
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${currentSize.bgCircle} rounded-full bg-primary-500/10`}></div>
          </div>
          <div className="relative z-10 flex items-center justify-center">
            <svg
              className={`${currentSize.spinner} text-primary-500`}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
              />
              <path
                className="opacity-75"
                d="M10,50 A40,40 0 0,1 50,10"
                strokeLinecap="round"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h2 className={`${currentSize.title} font-semibold text-gray-900`}>{displayMessage}</h2>
          <p className={`${currentSize.subtitle} text-gray-500`}>{t('common.loading.pleaseWait')}</p>
        </div>

        <div className="mt-4 sm:mt-6 relative">
          <div
            className={`${currentSize.progress} w-full bg-gray-200 rounded-full overflow-hidden`}
          >
            <div className="h-full bg-primary-500 rounded-full w-1/3 loading-bar"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .loading-bar {
          animation: loading 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
