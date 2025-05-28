'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState({
    success: false,
    message: '',
    orderId: '',
    amount: 0,
    transactionNo: '',
    responseCode: '',
    loading: true
  })

  useEffect(() => {
    const success = searchParams.get('success') === 'true'
    const message = searchParams.get('message') || ''
    const orderId = searchParams.get('orderId') || ''
    const amount = parseFloat(searchParams.get('amount') || '0')
    const transactionNo = searchParams.get('transactionNo') || ''
    const responseCode = searchParams.get('responseCode') || ''

    setResult({
      success,
      message,
      orderId,
      amount,
      transactionNo,
      responseCode,
      loading: false
    })
  }, [searchParams])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (result.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-8 text-center ${
          result.success 
            ? 'bg-gradient-to-r from-green-500 to-green-600' 
            : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            {result.success ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {result.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
          </h1>
          
          <p className="text-white/90 text-sm">
            {result.success ? 'Giao dịch của bạn đã được xử lý thành công' : 'Có lỗi xảy ra trong quá trình thanh toán'}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Message */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 text-sm leading-relaxed">
              {result.message}
            </p>
          </div>

          {/* Transaction Details */}
          {result.orderId && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Chi tiết giao dịch</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium text-gray-900">{result.orderId}</span>
                </div>
                
                {result.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(result.amount)}</span>
                  </div>
                )}
                
                {result.transactionNo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium text-gray-900">{result.transactionNo}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã phản hồi:</span>
                  <span className={`font-medium ${
                    result.responseCode === '00' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.responseCode}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 space-y-3">
            {result.success ? (
              <>
                <Link 
                  href="/orders/history" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 block text-center"
                >
                  Xem đơn hàng
                </Link>
                <Link 
                  href="/" 
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 block text-center"
                >
                  Về trang chủ
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/checkout" 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 block text-center"
                >
                  Thử lại thanh toán
                </Link>
                <Link 
                  href="/contact" 
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 block text-center"
                >
                  Liên hệ hỗ trợ
                </Link>
              </>
            )}
          </div>

          {/* Note */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {result.success 
                ? 'Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi'
                : 'Vui lòng kiểm tra thông tin thanh toán và thử lại'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 