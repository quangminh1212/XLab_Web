'use client';

import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import SessionProvider from '@/components/SessionProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { errorLog } from '@/utils/debugHelper';

/**
 * Component tập trung tất cả global providers và bọc chúng trong ErrorBoundary
 * Việc tách riêng các providers giúp dễ quản lý và debug hơn
 */
export function Providers({ children }: { children: React.ReactNode }) {
  try {
    return (
      <ErrorBoundary>
        <SessionProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SessionProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    errorLog('Error in Providers component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-red-600 text-xl font-bold mb-4">Lỗi khi khởi tạo ứng dụng</h2>
          <p className="text-gray-700 mb-4">
            Đã xảy ra lỗi trong quá trình khởi tạo. Vui lòng tải lại trang hoặc liên hệ hỗ trợ.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors w-full"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
} 