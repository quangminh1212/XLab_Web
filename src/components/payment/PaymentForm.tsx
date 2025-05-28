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
  const [verificationMethod, setVerificationMethod] = useState<'code' | 'confirm' | 'vnpay'>('vnpay')
  const [isPolling, setIsPolling] = useState<boolean>(false)
  const [pollingAttempts, setPollingAttempts] = useState<number>(0)
  const [transactionStartTime, setTransactionStartTime] = useState<string>('')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (verificationMethod === 'code') {
      if (!verificationCode.trim()) {
        newErrors.verificationCode = 'Vui lòng nhập mã xác thực sau khi chuyển khoản'
      } else if (verificationCode.length < 6) {
        newErrors.verificationCode = 'Mã xác thực phải có ít nhất 6 ký tự'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Hàm format thời gian cho VNPay
  const formatDateTime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`
  }

  // Hàm polling VNPay để check trạng thái thanh toán
  const pollVNPayStatus = async (orderId: string, transactionDate: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/payment/vnpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          transactionDate,
          amount
        })
      })

      const result = await response.json()
      console.log('VNPay polling result:', result)

      if (result.success && result.status === '00') {
        // Thanh toán thành công
        return true
      } else if (result.success && result.status === '01') {
        // Giao dịch chưa hoàn tất, tiếp tục polling
        return false
      } else {
        // Giao dịch có lỗi
        throw new Error(result.statusText || 'Giao dịch không thành công')
      }
    } catch (error) {
      console.error('VNPay polling error:', error)
      throw error
    }
  }

  // Hàm auto-check với polling
  const startAutoVerification = async (orderId: string) => {
    const transactionDate = formatDateTime(new Date())
    setTransactionStartTime(transactionDate)
    setIsPolling(true)
    setPollingAttempts(0)

    const maxAttempts = 30 // Tối đa 5 phút (30 lần x 10 giây)
    let attempts = 0

    const poll = async (): Promise<void> => {
      try {
        attempts++
        setPollingAttempts(attempts)

        const isSuccess = await pollVNPayStatus(orderId, transactionDate)
        
        if (isSuccess) {
          // Thanh toán thành công
          setIsPolling(false)
          const transactionId = `VNP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          
          if (onSuccess) {
            onSuccess(transactionId)
          } else {
            router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}`)
          }
          return
        }

        // Nếu chưa thành công và chưa hết lần thử
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000) // Đợi 10 giây rồi thử lại
        } else {
          // Hết lần thử
          setIsPolling(false)
          setErrors({ submit: 'Không thể xác thực thanh toán tự động. Vui lòng chọn phương thức khác hoặc thử lại.' })
        }
      } catch (error) {
        setIsPolling(false)
        setErrors({ submit: `Lỗi xác thực thanh toán: ${error instanceof Error ? error.message : 'Unknown error'}` })
      }
    }

    // Bắt đầu polling sau 5 giây (cho người dùng thời gian chuyển khoản)
    setTimeout(poll, 5000)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      if (verificationMethod === 'vnpay') {
        // Tự động xác thực VNPay
        await startAutoVerification(orderId)
        setIsLoading(false)
      } else {
        // Phương thức thủ công như cũ
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const transactionId = verificationMethod === 'code' 
          ? `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          : `CONF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        
        setIsLoading(false)
        
        if (onSuccess) {
          onSuccess(transactionId)
        } else {
          router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}`)
        }
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
    accountName: 'Bach Minh Quang',
    accountNumber: '669912122000'
  };

  // Tạo QR Code VietQR
  const generateQRCode = () => {
    const bankId = 'MB' // MBBank
    const accountNo = bankInfo.accountNumber
    const amount_number = amount
    const addInfo = orderId
    const template = 'compact' // Template compact - chỉ QR thuần túy không có văn bản
    
    // Đảm bảo encode đúng các thông tin
    const encodedAccountName = encodeURIComponent(bankInfo.accountName)
    const encodedAddInfo = encodeURIComponent(addInfo)
    
    // Sử dụng format đầy đủ với tất cả parameters
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount_number}&addInfo=${encodedAddInfo}&accountName=${encodedAccountName}`
    
    // Debug log để kiểm tra URL
    console.log('QR URL:', qrUrl)
    console.log('Amount:', amount_number)
    console.log('Order ID:', addInfo)
    console.log('Account Name:', bankInfo.accountName)
    
    return qrUrl
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header với màu XLab */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Chi tiết thanh toán</h2>
            <p className="text-primary-100 text-sm">Chuyển khoản ngân hàng và xác thực</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg border border-gray-200">
        {/* Tổng tiền với màu XLab */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-600">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-primary-600">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Layout chính */}
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Cột trái - QR Code và hướng dẫn */}
          <div className="p-6 lg:border-r border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0zM3 7a2 2 0 012-2h14a2 2 0 012 2v0M8 12h.01M12 12h.01M16 12h.01" />
                </svg>
                Quét mã thanh toán
              </h3>
              
              {/* QR Code thật từ VietQR */}
              <div className="relative inline-block">
                <div className="w-80 h-80 relative">
                  <Image 
                    src={generateQRCode()}
                    alt="VietQR Payment Code"
                    fill
                    className="object-contain rounded-lg"
                    priority
                    onError={(e) => {
                      // Fallback nếu API VietQR lỗi
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-3 font-medium">Quét mã QR để chuyển khoản nhanh</p>
            </div>

            {/* Hướng dẫn với màu XLab */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Hướng dẫn thanh toán
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">1</span>
                  <span className="text-sm text-primary-700">Mở ứng dụng Bank</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">2</span>
                  <span className="text-sm text-primary-700">Quét QR Code hoặc nhập thông tin bên phải</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">3</span>
                  <span className="text-sm text-primary-700">Xác nhận và lấy mã giao dịch</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">4</span>
                  <span className="text-sm text-primary-700">Nhập mã xác thực bên phải</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải - Thông tin và xác thực */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Thông tin chuyển khoản
            </h3>
            
            {/* Thông tin ngân hàng với màu XLab */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Ngân hàng:</span>
                  <span className="font-semibold text-gray-900">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Chủ tài khoản:</span>
                  <span className="font-semibold text-gray-900">{bankInfo.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Số tài khoản:</span>
                  <span className="font-mono font-bold text-primary-600 text-lg">{bankInfo.accountNumber}</span>
                </div>
                <hr className="border-gray-300"/>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Số tiền:</span>
                  <span className="text-lg font-bold text-primary-600">{formatCurrency(amount)}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Nội dung chuyển khoản:</span>
                  <div className="bg-primary-50 border border-primary-200 rounded-md p-3 text-center">
                    <span className="font-mono font-bold text-primary-700">{orderId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form xác thực với màu XLab */}
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
              <h4 className="font-semibold text-secondary-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Xác thực thanh toán
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn phương thức xác thực
                  </label>
                  <div className="space-y-3">
                    {/* Phương thức VNPay tự động */}
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${verificationMethod === 'vnpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        value="vnpay"
                        checked={verificationMethod === 'vnpay'}
                        onChange={(e) => setVerificationMethod(e.target.value as 'code' | 'confirm' | 'vnpay')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Tự động xác thực VNPay (Khuyến nghị)
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Hoàn toàn tự động - hệ thống tự kiểm tra sau khi chuyển khoản</p>
                      </div>
                    </label>

                    {/* Phương thức xác nhận đơn giản */}
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${verificationMethod === 'confirm' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        value="confirm"
                        checked={verificationMethod === 'confirm'}
                        onChange={(e) => setVerificationMethod(e.target.value as 'code' | 'confirm' | 'vnpay')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Xác nhận đã chuyển khoản
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Đơn giản, nhanh chóng - chỉ cần click xác nhận</p>
                      </div>
                    </label>

                    {/* Phương thức nhập mã */}
                    <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${verificationMethod === 'code' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        value="code"
                        checked={verificationMethod === 'code'}
                        onChange={(e) => setVerificationMethod(e.target.value as 'code' | 'confirm' | 'vnpay')}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Nhập mã xác thực
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Bảo mật cao - nhập mã giao dịch từ SMS/App bank</p>
                      </div>
                    </label>
                  </div>
                </div>
                 
                {verificationMethod === 'code' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div>
                      <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Mã xác thực (Mã giao dịch sau khi chuyển khoản)
                      </label>
                      <input
                        id="verificationCode"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Nhập mã giao dịch hoặc mã xác thực"
                        className={`w-full border ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors`}
                      />
                      {errors.verificationCode && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors.verificationCode}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-600">
                        💡 Nhập mã giao dịch từ SMS/App ngân hàng hoặc 6 số cuối của số tài khoản bạn chuyển từ
                      </p>
                    </div>
                  </div>
                )}

                {verificationMethod === 'confirm' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-green-800">Xác nhận thanh toán</p>
                        <p className="text-xs text-green-700 mt-1">
                          Bằng cách click nút bên dưới, bạn xác nhận đã chuyển khoản <strong>{formatCurrency(amount)}</strong> 
                          {' '}vào tài khoản <strong>{bankInfo.accountNumber}</strong> với nội dung <strong>{orderId}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* VNPay Auto Status */}
                {verificationMethod === 'vnpay' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Xác thực tự động VNPay</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Sau khi click "Bắt đầu xác thực tự động", hệ thống sẽ tự động kiểm tra trạng thái thanh toán của bạn qua API VNPay. 
                          Bạn chỉ cần chuyển khoản theo QR Code bên trái.
                        </p>
                        {isPolling && (
                          <div className="mt-3 p-3 bg-white border border-blue-300 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-sm font-medium text-blue-800">Đang kiểm tra giao dịch...</span>
                            </div>
                            <p className="text-xs text-blue-600">
                              Lần thử: {pollingAttempts}/30 • Kiểm tra lại sau 10 giây • 
                              Thời gian chờ tối đa: 5 phút
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
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
                  disabled={isLoading || isPolling}
                  className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${isLoading || isPolling ? 'opacity-70 cursor-not-allowed' : 'hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'}`}
                >
                  {isLoading || isPolling ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isPolling ? 'Đang kiểm tra giao dịch...' : 'Đang xác thực...'}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {verificationMethod === 'vnpay' ? 'Bắt đầu xác thực tự động' : 
                       verificationMethod === 'confirm' ? 'Xác nhận đã chuyển khoản' : 'Xác thực với mã'}
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>
                  <strong>Lưu ý:</strong> Đơn hàng sẽ được xác nhận trong vòng 5-10 phút sau khi xác thực thành công. Vui lòng chụp lại biên lai chuyển khoản.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentForm 