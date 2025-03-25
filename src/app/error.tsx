'use client'

import { useEffect } from 'react'
import Link from 'next/link'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  // Log lỗi khi component được render
  useEffect(() => {
    // Ghi log lỗi chi tiết ra console cho việc debug
    console.error('[App] Error caught by Error boundary:', error)
    console.error('[App] Error details:', {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack
    })

    // Kiểm tra nếu là lỗi từ NextAuth
    const isNextAuthError = 
      error.message?.includes('next-auth') || 
      error.stack?.includes('next-auth') ||
      error.name === 'NextAuthError';
    
    if (isNextAuthError) {
      console.error('[App] NextAuth error detected. Please check your NextAuth configuration');
      console.error('[App] Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are properly configured');
    }
    
    // Kiểm tra lỗi liên quan đến React/Next.js Suspense/lazy loading
    const isSuspenseError = 
      error.message?.includes('suspended') || 
      error.message?.includes('lazy');
    
    if (isSuspenseError) {
      console.error('[App] Suspense/Lazy loading error detected. Check components using suspense or lazy loading');
    }
    
    // Có thể gửi lỗi đến service như Sentry ở đây
  }, [error])
  
  // Xác định thông báo lỗi thân thiện với người dùng
  const getUserFriendlyMessage = () => {
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return "Có vấn đề kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn và thử lại.";
    }
    
    if (error.message?.includes('auth') || error.message?.includes('authentication')) {
      return "Xảy ra lỗi xác thực. Vui lòng đăng nhập lại.";
    }
    
    if (error.message?.includes('permission') || error.message?.includes('access')) {
      return "Bạn không có quyền truy cập nội dung này.";
    }
    
    return "Rất tiếc, đã có một lỗi xảy ra. Chúng tôi đang khắc phục vấn đề này.";
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đã xảy ra lỗi
          </h2>
          <div className="mt-4 text-center text-sm text-gray-600">
            {getUserFriendlyMessage()}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-red-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Chi tiết lỗi</h3>
              <div className="mt-2 text-sm text-red-700 space-y-1">
                <p>{error.message || 'Lỗi không xác định'}</p>
                {error.digest && (
                  <p className="text-xs mt-1 font-mono">Mã lỗi: {error.digest}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={reset}
            className="group relative w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Thử lại
          </button>
          
          <Link 
            href="/"
            className="group relative w-1/2 ml-3 flex justify-center py-2 px-4 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Quay về trang chủ
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Xem thêm thông tin kỹ thuật</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto max-h-40">
              {error.stack || 'Không có thông tin chi tiết'}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
} 