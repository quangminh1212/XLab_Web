'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { errorLog } from '@/utils/debugHelper';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Component bắt lỗi trong React, giúp hiển thị lỗi và ngăn ứng dụng crash
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Cập nhật state để hiển thị fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log lỗi ra console với stack trace đầy đủ
    errorLog('Lỗi được bắt bởi ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Hiển thị UI khi xảy ra lỗi
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 bg-red-50 border border-red-300 rounded-md m-4">
          <h2 className="text-red-700 text-lg font-semibold mb-2">Đã xảy ra lỗi</h2>
          <div className="p-3 bg-white rounded border border-red-200 text-sm">
            <p className="font-mono text-red-600">{this.state.error?.message}</p>
            <p className="mt-2 text-gray-600 text-xs">Vui lòng tải lại trang hoặc quay lại sau.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 