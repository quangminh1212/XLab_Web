'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị UI thay thế
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Hiển thị UI thay thế hoặc fallback được cung cấp
      return this.props.fallback || (
        <div className="p-4 max-w-xl mx-auto my-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Đã xảy ra lỗi</h2>
          <details className="mt-2 text-sm text-red-600">
            <summary className="cursor-pointer">Chi tiết lỗi</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded text-red-800 overflow-auto text-xs">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
} 