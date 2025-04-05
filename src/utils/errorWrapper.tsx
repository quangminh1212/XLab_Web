'use client';

import React, { ComponentType, FC } from 'react';
import { errorLog } from './debugHelper';

// Hàm bọc các component để catch lỗi bên trong
export function withErrorHandling<P extends object>(
  Component: ComponentType<P>,
  componentName = Component.displayName || Component.name || 'UnknownComponent'
): FC<P> {
  const WrappedComponent: FC<P> = (props) => {
    try {
      // Render component bên trong try/catch
      return <Component {...props} />;
    } catch (error) {
      // Log lỗi và hiển thị fallback UI
      errorLog(`Lỗi rendering component ${componentName}:`, error);
      return (
        <div className="p-3 bg-red-50 border border-red-300 rounded-md">
          <h3 className="text-red-600 font-medium">Lỗi hiển thị {componentName}</h3>
          <p className="text-sm text-red-500">{(error as Error)?.message || 'Đã xảy ra lỗi không xác định'}</p>
        </div>
      );
    }
  };

  // Giữ displayName ban đầu để dễ debug
  WrappedComponent.displayName = `withErrorHandling(${componentName})`;
  return WrappedComponent;
}

// HOC thứ hai để bắt lỗi ở event handlers
export function withSafeEventHandlers<P extends object>(
  Component: ComponentType<P>,
  componentName = Component.displayName || Component.name || 'UnknownComponent'
): FC<P> {
  const safeProps = (originalProps: any): P => {
    const safeProps: any = {};

    // Lặp qua tất cả props
    Object.entries(originalProps).forEach(([key, value]) => {
      // Nếu prop là function, wrap nó trong try/catch
      if (typeof value === 'function') {
        safeProps[key] = (...args: any[]) => {
          try {
            return (value as Function)(...args);
          } catch (error) {
            errorLog(`Lỗi trong event handler ${key} của component ${componentName}:`, error);
            // Không throw lỗi để tránh crash ứng dụng
            return undefined;
          }
        };
      } else {
        // Giữ nguyên các prop không phải function
        safeProps[key] = value;
      }
    });

    return safeProps as P;
  };

  const WrappedComponent: FC<P> = (props) => {
    return <Component {...safeProps(props)} />;
  };

  // Giữ displayName ban đầu để dễ debug
  WrappedComponent.displayName = `withSafeEventHandlers(${componentName})`;
  return WrappedComponent;
}

// Kết hợp cả hai HOC
export function createSafeComponent<P extends object>(
  Component: ComponentType<P>,
  componentName = Component.displayName || Component.name || 'UnknownComponent'
): FC<P> {
  return withErrorHandling(
    withSafeEventHandlers(Component, componentName),
    componentName
  );
} 