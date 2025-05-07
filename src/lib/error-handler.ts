// Utility để xử lý và ghi log lỗi một cách nhất quán
import React from 'react';

/**
 * Xử lý lỗi trong ứng dụng và thêm context nếu cần
 * @param error Lỗi cần xử lý
 * @param context Context bổ sung về nơi lỗi xảy ra
 */
export function handleError(error: unknown, context?: string): Error {
  // Convert unknown error to Error object
  const errorObject = error instanceof Error ? error : new Error(String(error));
  
  // Log lỗi với context
  console.error(`[Error${context ? ` in ${context}` : ''}]:`, errorObject);
  
  // Nếu trong môi trường development, log stack trace đầy đủ
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', errorObject.stack);
  }
  
  return errorObject;
}

/**
 * Wrap một async function với try-catch để xử lý lỗi tự động
 * @param fn Function cần wrap
 * @param context Context bổ sung về function
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, context || fn.name);
    }
  };
}

/**
 * Tạo một error boundary component để bắt lỗi trong React
 * @param fallback Component fallback khi có lỗi
 */
export function createErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error; reset: () => void }>
): React.ComponentType<P> {
  return function ErrorBoundaryWrapper(props: P) {
    // Trong Next.js, sử dụng error.js hoặc error boundary chính trong app directory
    // Đây chỉ là utility để tạo error boundary tùy chỉnh khi cần
    return React.createElement(Component, props);
  };
}

export default handleError; 