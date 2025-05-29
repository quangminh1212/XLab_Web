"use client";

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { generateDetailedOrderId, generateDetailedTransactionId } from '@/shared/utils/orderUtils'

interface PaymentFormProps {
  amount: number
  orderId?: string
  productName?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

const PaymentForm = ({ 
  amount, 
  orderId,
  productName = "Sản phẩm XLab",
  onSuccess,
  onError 
}: PaymentFormProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [finalOrderId, setFinalOrderId] = useState<string>('')
  const [balance, setBalance] = useState<number>(0)
  const [loadingBalance, setLoadingBalance] = useState(false)

  // Generate orderId chỉ trên client side để tránh hydration mismatch
  useEffect(() => {
    if (orderId) {
      setFinalOrderId(orderId)
    } else {
      setFinalOrderId(generateDetailedOrderId())
    }
  }, [orderId])

  // Lấy số dư tài khoản
  useEffect(() => {
    if (session?.user) {
      fetchBalance()
    }
  }, [session])

  const fetchBalance = async () => {
    try {
      setLoadingBalance(true)
      const response = await fetch('/api/user/balance')
      if (response.ok) {
        const data = await response.json()
        setBalance(data.balance || 0)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoadingBalance(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  const handleBalancePayment = async (e: FormEvent) => {
    e.preventDefault()
    
    if (balance < amount) {
      setErrors({ balance: 'Số dư không đủ để thanh toán' })
      return
    }

    setIsLoading(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/payment/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          orderId: finalOrderId,
          productName
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Cập nhật lại số dư
        await fetchBalance()
        
        const transactionId = data.transaction?.id || generateDetailedTransactionId()
        
        if (onSuccess) {
          onSuccess(transactionId)
        } else {
          router.push(`/payment/success?orderId=${finalOrderId}&transactionId=${transactionId}&product=${encodeURIComponent(productName)}&amount=${amount}`)
        }
      } else {
        setErrors({ submit: data.error || 'Có lỗi xảy ra khi thanh toán' })
      }
    } catch (error) {
      console.error('Error processing balance payment:', error)
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' })
    } finally {
      setIsLoading(false)
    }
  }

  const isBalanceEnough = balance >= amount

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Thanh toán bằng số dư</h2>
            <p className="text-teal-100 text-sm">Sử dụng số dư tài khoản để thanh toán</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-lg mx-auto">
          {/* Thông tin số dư */}
          <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 mb-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">Số dư hiện tại</h3>
              {loadingBalance ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
                  <span className="ml-2 text-teal-600">Đang tải...</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-teal-900">{formatCurrency(balance)}</p>
              )}
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6" />
              </svg>
              Thông tin đơn hàng
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sản phẩm:</span>
                <span className="font-medium text-gray-800">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-teal-600 text-xs">
                  {finalOrderId || 'Đang tạo...'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-2 mt-2">
                <span className="text-gray-800 font-medium">Tổng tiền:</span>
                <span className="font-bold text-xl text-teal-800">{formatCurrency(amount)}</span>
              </div>
            </div>
          </div>

          {/* Kiểm tra số dư */}
          {!isBalanceEnough && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-800 font-medium text-sm">Số dư không đủ</p>
                  <p className="text-red-700 text-xs">
                    Bạn cần thêm {formatCurrency(amount - balance)} để hoàn tất thanh toán
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <a
                  href="/account/deposit"
                  className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nạp tiền ngay
                </a>
              </div>
            </div>
          )}

          {/* Form thanh toán */}
          <form onSubmit={handleBalancePayment} className="space-y-4">
            {errors.balance && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.balance}
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.submit}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !isBalanceEnough || loadingBalance}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                isLoading || !isBalanceEnough || loadingBalance
                  ? 'bg-gray-400 cursor-not-allowed scale-95'
                  : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-300 hover:scale-105 shadow-lg hover:shadow-teal-600/30'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý thanh toán...
                </div>
              ) : !isBalanceEnough ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Số dư không đủ
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thanh toán {formatCurrency(amount)}
                </div>
              )}
            </button>
          </form>

          {/* Thông tin bảo mật */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-blue-800 font-medium text-sm mb-1">Thanh toán an toàn</p>
                <p className="text-blue-700 text-xs leading-relaxed">
                  Giao dịch được thực hiện ngay lập tức và bảo mật tuyệt đối. Bạn sẽ nhận được xác nhận đơn hàng sau khi thanh toán thành công.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentForm 