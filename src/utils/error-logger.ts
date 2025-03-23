'use client'

/**
 * Utility để log lỗi một cách chi tiết
 */

type ErrorDetail = {
  message: string;
  stack?: string;
  code?: string;
  name?: string;
  componentStack?: string;
  [key: string]: any;
}

// Format lỗi để dễ đọc hơn trong console
export const formatError = (error: any): ErrorDetail => {
  try {
    // Nếu error có kiểu Error chuẩn
    if (error instanceof Error) {
      return {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...(error as any),
      }
    }
    
    // Nếu là object (không phải Error) hoặc string
    if (typeof error === 'object') {
      return {
        ...error,
        message: error.message || 'Unknown error object',
      }
    }
    
    // Nếu là string hoặc kiểu primitive khác
    return {
      message: String(error),
    }
  } catch (formatError) {
    // Trường hợp không format được lỗi
    return {
      message: 'Could not format error',
      formatError: String(formatError),
    }
  }
}

// Log lỗi chi tiết ra console
export const logError = (
  error: any,
  context: string = 'App',
  additionalInfo: Record<string, any> = {}
) => {
  const errorDetail = formatError(error)
  
  console.error(
    `[${context}] ERROR:`,
    errorDetail.message,
    '\n\nDetails:',
    { ...errorDetail, ...additionalInfo },
    '\n\nStack:',
    errorDetail.stack || 'No stack trace available'
  )
  
  return errorDetail
}

// Thiết lập global error handler nếu trong browser
export const setupGlobalErrorHandlers = () => {
  if (typeof window !== 'undefined') {
    // Bắt lỗi JS không xử lý
    window.onerror = (message, source, lineno, colno, error) => {
      logError(error || message, 'Global', { source, lineno, colno })
      return false // Cho phép xử lý lỗi mặc định tiếp tục
    }
    
    // Bắt Promise rejection không xử lý
    window.addEventListener('unhandledrejection', (event) => {
      logError(event.reason, 'UnhandledPromise')
    })
    
    console.log('[ErrorLogger] Global error handlers set up')
  }
}

// Sử dụng như component
export const ErrorLogger = () => {
  setupGlobalErrorHandlers()
  return null
} 