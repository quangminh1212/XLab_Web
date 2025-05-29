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
      // Call API xác thực thật
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          verificationCode: verificationCode.trim(),
          amount
        })
      })
      
      const result = await response.json()
      
      setIsLoading(false)
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.transactionId)
        } else {
          router.push(`/payment/success?orderId=${orderId}&transactionId=${result.transactionId}`)
        }
      } else {
        const errorMessage = result.message || 'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.'
        
        if (onError) {
          onError(errorMessage)
        } else {
          setErrors({ submit: errorMessage })
        }
      }
    } catch (error) {
      setIsLoading(false)
      
      const errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.'
      
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
    const addInfo = orderId
    const template = 'compact' // Template compact - chỉ QR thuần túy không có văn bản
    
    // Đảm bảo encode đúng các thông tin
    const encodedAccountName = encodeURIComponent(bankInfo.accountName)
    const encodedAddInfo = encodeURIComponent(addInfo)
    
    // Sử dụng format đầy đủ với tất cả parameters
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodedAddInfo}&accountName=${encodedAccountName}`
    
    // Debug log để kiểm tra URL
    console.log('QR URL:', qrUrl)
    console.log('Amount:', amount)
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 002 2v14a2 2 0 002 2z" />
                </svg>
                Hướng dẫn thanh toán MBBank
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">1</span>
                  <span className="text-sm text-primary-700">Mở ứng dụng MBBank trên điện thoại</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">2</span>
                  <span className="text-sm text-primary-700">Quét QR Code hoặc chuyển khoản đến thông tin bên phải</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">3</span>
                  <span className="text-sm text-primary-700">Sau khi chuyển tiền thành công, nhập <strong>mã giao dịch</strong> vào form bên dưới</span>
                </div>
              </div>
              
              {/* Thông tin xác thực tự động */}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hệ thống xác thực tự động
                </div>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• Tự động tra soát giao dịch từ Google Sheets thực tế</li>
                  <li>• Kết nối trực tiếp với bảng tính MBBank online</li>
                  <li>• Kiểm tra tự động qua cột Code TT</li>
                  <li>• Xác thực thời gian thực không cần thủ công</li>
                </ul>
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
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Mã xác thực MBBank (OTP hoặc Mã giao dịch)
                  </label>
                  <input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Nhập mã OTP hoặc mã giao dịch từ MBBank"
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
                  
                  {/* Hướng dẫn xác thực tự động */}
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 font-medium mb-2">🔄 Xác thực tự động từ Google Sheets:</p>
                    <div className="text-xs text-blue-700 space-y-1 mb-3">
                      <div>• Hệ thống tự động kết nối với Google Sheets chứa dữ liệu giao dịch MBBank</div>
                      <div>• Tự động kiểm tra nội dung chuyển khoản qua cột <strong>Code TT</strong></div>
                      <div>• Chỉ cần nhập <strong>mã giao dịch</strong> từ SMS hoặc app MBBank</div>
                    </div>
                    
                    <p className="text-xs text-blue-800 font-medium mb-2">📱 Các loại mã hỗ trợ:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                      <div>• Mã giao dịch: FT...</div>
                      <div>• Số Trace: 6 số</div>
                      <div>• Mã OTP SMS: 6-8 số</div>
                      <div>• Internet Banking: IB...</div>
                    </div>
                  
                  {/* Mẫu giao dịch có sẵn để test */}
                  <div className="mt-3 pt-3 border-t border-blue-300">
                    <p className="text-xs text-blue-600 font-medium mb-2">💡 Dữ liệu mẫu từ Google Sheets:</p>
                    <div className="bg-blue-100 p-2 rounded text-xs text-blue-800">
                      <div><strong>Mã giao dịch:</strong> <code className="bg-white px-1 rounded">FT25149200931766</code></div>
                      <div><strong>Số Trace:</strong> <code className="bg-white px-1 rounded">728744</code></div>
                      <div><strong>Số tiền:</strong> <code className="bg-white px-1 rounded">4000</code> VND</div>
                      <div><strong>Code TT:</strong> <code className="bg-white px-1 rounded">Tiền vào</code></div>
                    </div>
                  </div>
                  </div>
                </div>
                
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
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xác thực...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Xác nhận đã chuyển khoản
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