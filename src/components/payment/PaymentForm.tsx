'use client'

import { useState, FormEvent, useMemo, useEffect } from 'react'
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
  orderId,
  onSuccess,
  onError 
}: PaymentFormProps) => {
  const router = useRouter()
  
  // Tạo orderId stable để tránh hydration mismatch
  const [stableOrderId, setStableOrderId] = useState<string>('')
  
  // Sử dụng useEffect để tạo orderId chỉ ở client side
  useEffect(() => {
    if (!orderId && !stableOrderId) {
      setStableOrderId(`ORDER-${Date.now()}`)
    }
  }, [orderId, stableOrderId])
  
  // Sử dụng orderId được truyền vào hoặc stableOrderId được tạo
  const finalOrderId = orderId || stableOrderId
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
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

  // Hàm polling Bank API để check trạng thái thanh toán
  const pollBankAPIStatus = async (orderId: string, transactionDate: string): Promise<boolean> => {
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
      console.log('Bank API polling result:', result)

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
      console.error('Bank API polling error:', error)
      throw error
    }
  }

  // Hàm auto-check với polling qua Bank API/SMS Banking
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

        const isSuccess = await pollBankAPIStatus(orderId, transactionDate)
        
        if (isSuccess) {
          // Thanh toán thành công
          setIsPolling(false)
          const transactionId = `BANK-${Date.now()}-${Math.floor(Math.random() * 1000)}`
          
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
          setErrors({ submit: 'Không thể xác thực thanh toán tự động. Vui lòng thử lại.' })
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
    
    setIsLoading(true)
    
    try {
      // Tự động xác thực qua Bank API/SMS Banking
      await startAutoVerification(finalOrderId)
      setIsLoading(false)
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
    const addInfo = finalOrderId
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
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-t-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Chi tiết thanh toán</h2>
            <p className="text-teal-100 text-sm">Thanh toán tự động qua VNPay</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg border border-gray-200">
        {/* Tổng tiền với màu XLab */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-600">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-teal-600">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Layout chính */}
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Cột trái - QR Code và hướng dẫn */}
          <div className="p-6 lg:border-r border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0zM3 7a2 2 0 012-2h14a2 2 0 012 2v0M8 12h.01M12 12h.01M16 12h.01" />
                </svg>
                Quét mã thanh toán
              </h3>
              
              {/* QR Code thật từ VietQR */}
              <div className="relative inline-block">
                <div className="w-80 h-80 relative">
                  {finalOrderId ? (
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
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-sm">Đang tạo mã QR...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-3 font-medium">Quét mã QR để chuyển khoản nhanh</p>
            </div>

            {/* Hướng dẫn với màu XLab */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Hướng dẫn thanh toán
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">1</span>
                  <span className="text-sm text-teal-700">Mở ứng dụng Bank</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">2</span>
                  <span className="text-sm text-teal-700">Quét QR Code hoặc nhập thông tin bên phải</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">3</span>
                  <span className="text-sm text-teal-700">Xác nhận chuyển khoản</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">4</span>
                  <span className="text-sm text-teal-700">Click "Bắt đầu xác thực" để hệ thống tự động kiểm tra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải - Thông tin và xác thực */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="font-mono font-bold text-teal-600 text-lg">{bankInfo.accountNumber}</span>
                </div>
                <hr className="border-gray-300"/>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Số tiền:</span>
                  <span className="text-lg font-bold text-teal-600">{formatCurrency(amount)}</span>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium text-gray-600 block mb-2">Nội dung chuyển khoản:</span>
                  <div className="bg-teal-50 border border-teal-200 rounded-md p-3 text-center">
                    {finalOrderId ? (
                      <span className="font-mono font-bold text-teal-700">{finalOrderId}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Đang tạo mã đơn hàng...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form xác thực thanh toán */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Xác thực thanh toán đa phương thức
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white border border-teal-300 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-teal-800">Bank API / SMS Banking</p>
                      <p className="text-xs text-teal-700 mt-1">
                        Sau khi chuyển khoản, click "Bắt đầu xác thực" để hệ thống tự động:
                      </p>
                      <ul className="text-xs text-teal-700 mt-2 ml-4 list-disc">
                        <li>Call API trực tiếp từ ngân hàng</li>
                        <li>Đọc thông tin qua SMS Banking</li>
                        <li>Hoặc các phương thức xác thực khác</li>
                      </ul>
                      <p className="text-xs text-teal-700 mt-1">
                        Quá trình hoàn toàn tự động, không cần nhập mã thủ công.
                      </p>
                      {isPolling && (
                        <div className="mt-3 p-3 bg-teal-100 border border-teal-300 rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="animate-spin h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm font-medium text-teal-800">Đang xác thực qua Bank API...</span>
                          </div>
                          <p className="text-xs text-teal-600">
                            Lần thử: {pollingAttempts}/30 • Kiểm tra SMS Banking & API • 
                            Thời gian chờ tối đa: 5 phút
                          </p>
                          <div className="mt-2 bg-white rounded-md p-2 border border-teal-200">
                            <div className="flex justify-between text-xs text-teal-600">
                              <span>Tiến độ xác thực:</span>
                              <span>{Math.round((pollingAttempts / 30) * 100)}%</span>
                            </div>
                            <div className="w-full bg-teal-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-teal-600 h-1.5 rounded-full transition-all duration-300" 
                                style={{ width: `${(pollingAttempts / 30) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{errors.submit}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isPolling || !finalOrderId}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading || isPolling ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isPolling ? 'Đang xác thực Bank API...' : 'Đang khởi tạo...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Bắt đầu xác thực Bank API
                    </>
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
                  <strong>Lưu ý:</strong> Hệ thống sẽ tự động kiểm tra thanh toán sau khi bạn chuyển khoản và click "Bắt đầu xác thực". 
                  Quá trình kiểm tra tối đa 5 phút.
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