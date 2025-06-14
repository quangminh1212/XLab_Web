'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Component hiển thị thông báo khi trang đang biên dịch
 */
const CompileIndicator: React.FC = () => {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingPath, setCompilingPath] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Hàm để xác định khi nào trang đang biên dịch
    const handleBeforeCompileStart = () => {
      setIsCompiling(true);
    };

    // Hàm lắng nghe sự kiện HMR của Next.js
    const handleHMREvents = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && 'type' in event.data) {
        const { type, data } = event.data;

        // Bắt đầu biên dịch
        if (type === 'building') {
          setIsCompiling(true);
          if (data && data.page) {
            setCompilingPath(data.page);
          }
        }

        // Biên dịch hoàn tất
        else if (type === 'built' || type === 'sync') {
          setIsCompiling(false);
          setCompilingPath(null);
        }

        // Lỗi biên dịch
        else if (type === 'error') {
          setIsCompiling(false);
          setCompilingPath(null);
        }
      }
    };

    // Theo dõi các sự kiện HMR của Next.js
    window.addEventListener('message', handleHMREvents);
    window.addEventListener('beforeunload', handleBeforeCompileStart);

    return () => {
      window.removeEventListener('message', handleHMREvents);
      window.removeEventListener('beforeunload', handleBeforeCompileStart);
    };
  }, []);

  if (!isCompiling) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border border-yellow-200 shadow-lg rounded-md p-3 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-yellow-500 mr-2 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <div>
          <div className="font-medium text-gray-800">{t('common.compiling')}</div>
          {compilingPath && (
            <div className="text-xs text-gray-600 mt-0.5 max-w-[200px] truncate">
              {compilingPath}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompileIndicator;
