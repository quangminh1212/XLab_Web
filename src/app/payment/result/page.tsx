"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const transactionId = searchParams.get('transactionId')
  const responseCode = searchParams.get('responseCode')
  const message = searchParams.get('message')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (value: string | null) => {
    if (!value) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(parseInt(value))
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'success':
        return {
          icon: '✅',
          title: 'Thanh toán thành công!',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconBg: 'bg-green-100'
        }
      case 'failed':
        return {
          icon: '❌',
          title: 'Thanh toán thất bại',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200', 
          textColor: 'text-red-800',
          iconBg: 'bg-red-100'
        }
      case 'error':
        return {
          icon: '⚠️',
          title: 'Lỗi xử lý thanh toán',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconBg: 'bg-yellow-100'
        }
      default:
        return {
          icon: '❓',
          title: 'Trạng thái không xác định',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconBg: 'bg-gray-100'
        }
    }
  }

  const statusInfo = getStatusInfo()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kết quả thanh toán
            </h1>
            <p className="text-gray-600">
              Chi tiết giao dịch của bạn
            </p>
          </div>

          {/* Result Card */}
          <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-xl p-8 mb-8 shadow-lg`}>
            
            {/* Status Icon */}
            <div className="text-center mb-6">
              <div className={`${statusInfo.iconBg} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                <span className="text-3xl">{statusInfo.icon}</span>
              </div>
              <h2 className={`text-2xl font-bold ${statusInfo.textColor} mb-2`}>
                {statusInfo.title}
              </h2>
              {message && (
                <p className={`${statusInfo.textColor} opacity-80`}>
                  {message}
                </p>
              )}
            </div>

            {/* Transaction Details */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Chi tiết giao dịch</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mã đơn hàng
                  </label>
                  <p className="font-mono font-semibold text-gray-900">
                    {orderId || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Số tiền
                  </label>
                  <p className="font-bold text-lg text-primary-600">
                    {formatCurrency(amount)}
                  </p>
                </div>

                {transactionId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mã giao dịch
                    </label>
                    <p className="font-mono font-semibold text-gray-900">
                      {transactionId}
                    </p>
                  </div>
                )}

                {responseCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mã phản hồi
                    </label>
                    <p className="font-mono text-gray-900">
                      {responseCode}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Thời gian
                  </label>
                  <p className="text-gray-900">
                    {new Date().toLocaleString('vi-VN')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Trạng thái
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'success' ? 'bg-green-100 text-green-800' :
                    status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status === 'success' ? 'Thành công' :
                     status === 'failed' ? 'Thất bại' : 
                     'Lỗi'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </Link>

            {status === 'success' && (
              <Link
                href="/orders/history"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xem đơn hàng
              </Link>
            )}

            {status === 'failed' && (
              <Link
                href={`/payment/checkout?orderId=${orderId}&amount=${amount}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Thử lại
              </Link>
            )}
          </div>

          {/* Support Contact */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Nếu bạn có thắc mắc về giao dịch này, vui lòng liên hệ{' '}
              <a href="mailto:support@xlab.vn" className="text-primary-600 hover:text-primary-700 underline">
                support@xlab.vn
              </a>
              {' '}hoặc hotline{' '}
              <a href="tel:1900123456" className="text-primary-600 hover:text-primary-700 underline">
                1900 123 456
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 