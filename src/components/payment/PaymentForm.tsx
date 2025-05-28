'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

interface PaymentFormProps {
  amount: number
  orderId?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

const PaymentForm = ({ 
  amount, 
  orderId = `ORDER-${Date.now()}`,
  onSuccess,
  onError 
}: PaymentFormProps) => {
  const router = useRouter()
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!verificationCode.trim()) {
      newErrors.verificationCode = 'Vui lòng nhập mã xác thực sau khi chuyển khoản'
    } else if (verificationCode.length < 6) {
      newErrors.verificationCode = 'Mã xác thực phải có ít nhất 6 ký tự'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Giả lập call API xác thực
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Giả lập transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      
      setIsLoading(false)
      
      if (onSuccess) {
        onSuccess(transactionId)
      } else {
        router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}`)
      }
    } catch (error) {
      setIsLoading(false)
      
      const errorMessage = 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.'
      
      if (onError) {
        onError(errorMessage)
      } else {
        setErrors({ submit: errorMessage })
      }
    }
  }

  // Thông tin ngân hàng
  const bankInfo = {
    bankName: 'MBBank (Ngân hàng Quân đội)',
    accountName: siteConfig.legal.companyName || 'CÔNG TY XLAB',
    accountNumber: '0123456789'
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-primary-500 text-white">
        <h2 className="text-2xl font-bold">Thanh toán chuyển khoản</h2>
        <p className="mt-1 text-primary-100">Chuyển khoản và nhập mã xác thực</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <div className="font-semibold text-lg mb-2">Chi tiết thanh toán</div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Tổng thanh toán:</span>
            <span className="text-xl font-bold text-primary-600">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Chia thành 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cột trái - Thông tin chuyển khoản */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-4 text-center text-lg">Thông tin chuyển khoản</h3>
            
            {/* Hiển thị logo MBBank */}
            <div className="text-center mb-4">
              <Image 
                src="/images/mbbank.jpg" 
                alt="MBBank Logo" 
                width={200} 
                height={100} 
                className="mx-auto rounded-lg shadow-sm"
              />
            </div>

            {/* QR Code giả lập */}
            <div className="text-center mb-4">
              <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg">
                <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Quét mã QR để chuyển khoản nhanh</p>
            </div>
            
            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">{bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Chủ tài khoản:</span>
                <span className="font-semibold">{bankInfo.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Số tài khoản:</span>
                <span className="font-mono font-semibold text-blue-600">{bankInfo.accountNumber}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium text-gray-600">Số tiền:</span>
                <span className="text-lg font-bold text-red-600">{formatCurrency(amount)}</span>
              </div>
              <div className="flex flex-col border-t pt-2">
                <span className="font-medium text-gray-600 mb-1">Nội dung chuyển khoản:</span>
                <span className="font-mono font-semibold text-green-600 bg-green-50 p-2 rounded text-center">{orderId}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 text-sm rounded border-l-4 border-blue-400">
              <p className="mb-2 font-medium text-blue-800">📋 Hướng dẫn chuyển khoản:</p>
              <ul className="list-decimal list-inside text-blue-700 space-y-1 text-xs">
                <li>Mở ứng dụng MBBank hoặc Internet Banking</li>
                <li>Chọn chuyển khoản trong nước</li>
                <li>Nhập thông tin tài khoản như trên</li>
                <li>Nhập chính xác nội dung chuyển khoản</li>
                <li>Xác nhận và hoàn tất giao dịch</li>
                <li>Sao chép mã giao dịch và nhập vào ô bên phải</li>
              </ul>
            </div>
          </div>

          {/* Cột phải - Form xác thực */}
          <div className="flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-grow">
                <h3 className="font-medium mb-4 text-center text-lg">Xác thực thanh toán</h3>
                
                <div className="mb-6">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Mã xác thực (Mã giao dịch sau khi chuyển khoản)
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Nhập mã giao dịch hoặc mã xác thực"
                    className={`w-full border ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.verificationCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Nhập mã giao dịch từ SMS/App ngân hàng hoặc 6 số cuối của số tài khoản bạn chuyển từ
                  </p>
                </div>
                
                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                    {errors.submit}
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <div className="mb-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-primary-600 text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xác thực...
                      </div>
                    ) : (
                      'Xác nhận đã chuyển khoản'
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="p-3 bg-yellow-50 text-xs rounded border-l-4 border-yellow-400">
                    <p className="font-medium text-yellow-800 mb-1">⚠️ Lưu ý quan trọng:</p>
                    <p className="text-yellow-700">Đơn hàng sẽ được xác nhận trong vòng 5-10 phút sau khi xác thực thành công. Vui lòng chụp lại biên lai chuyển khoản để hỗ trợ tra soát khi cần.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentForm 