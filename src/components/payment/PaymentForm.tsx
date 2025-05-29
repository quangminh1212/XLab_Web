"use client";

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  // Sử dụng orderId được truyền vào hoặc tạo mới
  const finalOrderId = orderId || generateDetailedOrderId();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  // Thông tin ngân hàng
  const bankInfo = {
    bankName: 'MBBank (Ngân hàng Quân đội)',
    accountName: 'Bach Minh Quang',
    accountNumber: '669912122000',
    bankCode: '970422' // Mã ngân hàng MBBank
  };

  // Tạo QR code cho chuyển khoản
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Tạo nội dung QR theo chuẩn VietQR
        const qrContent = `2|99|${bankInfo.bankCode}|${bankInfo.accountNumber}|${bankInfo.accountName}|${amount}|${finalOrderId}|VN`;
        
        const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
          width: 600,
          margin: 4,
          color: {
            dark: '#000000', // Màu đen cho QR code
            light: '#FFFFFF' // Nền trắng
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Lỗi tạo QR code:', error);
      }
    };

    generateQRCode();
  }, [amount, finalOrderId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const transactionId = generateDetailedTransactionId()
      
      setIsLoading(false)
      
      if (onSuccess) {
        onSuccess(transactionId)
      } else {
        router.push(`/payment/success?orderId=${finalOrderId}&transactionId=${transactionId}&product=${encodeURIComponent(productName)}&amount=${amount}`)
      }
    } catch (error) {
      setIsLoading(false)
      
      const errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.'
      
      if (onError) {
        onError(errorMessage)
      } else {
        setErrors({ submit: errorMessage })
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header với gradient màu XLab */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2v-2zM15 15h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM17 13h2v2h-2v-2zM19 15h2v2h-2v-2zM17 17h2v2h-2v-2zM19 19h2v2h-2v-2z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Thanh toán QR Code</h2>
            <p className="text-primary-100 text-sm">Quét mã để chuyển khoản nhanh chóng</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cột trái - QR Code */}
          <div>
            <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-8 mb-6 shadow-lg text-center">
              <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2v-2zM15 15h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM17 13h2v2h-2v-2zM19 15h2v2h-2v-2zM17 17h2v2h-2v-2zM19 19h2v2h-2v-2z"/>
                  </svg>
                </div>
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Quét mã QR để chuyển khoản
                </span>
              </h3>
              
              {qrCodeUrl ? (
                <div className="space-y-6">
                  <div className="relative inline-block">
                    {/* QR Code với viền đẹp */}
                    <div className="bg-white p-6 rounded-2xl border-4 border-gray-100 shadow-2xl relative overflow-hidden">
                      {/* Các góc trang trí */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary-600 rounded-tl-lg"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary-600 rounded-tr-lg"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary-600 rounded-bl-lg"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary-600 rounded-br-lg"></div>
                      
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code chuyển khoản" 
                        className="w-96 h-96 mx-auto block"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>
                    
                    {/* Logo XLab ở giữa (tùy chọn) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-white rounded-full p-3 shadow-lg border-2 border-primary-600">
                        <img 
                          src="/images/topup.png" 
                          alt="TopUp Logo" 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Hướng dẫn với icon động */}
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="relative">
                        <svg className="w-6 h-6 text-primary-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-primary-700 font-semibold">Mở app ngân hàng và quét mã QR</span>
                    </div>
                    <p className="text-sm text-primary-600 text-center">
                      Thông tin chuyển khoản sẽ được điền tự động
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-96 h-96 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tạo mã QR...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải - Thông tin thanh toán và Hướng dẫn */}
          <div>
            {/* Thông tin tổng hợp - đưa sang cột phải */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-xl p-6 mb-6 shadow-lg">
              <h4 className="font-bold text-lg text-teal-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Thông tin thanh toán</span>
              </h4>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Thông tin đơn hàng */}
                <div className="bg-white rounded-lg p-4 border border-teal-200">
                  <h5 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    Đơn hàng
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-mono font-bold text-teal-600">{finalOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-bold text-lg text-teal-800">{formatCurrency(amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Thông tin ngân hàng */}
                <div className="bg-white rounded-lg p-4 border border-teal-200">
                  <h5 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Ngân hàng
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-medium text-teal-800">{bankInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số TK:</span>
                      <span className="font-mono font-bold text-teal-600">{bankInfo.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ TK:</span>
                      <span className="font-medium text-teal-800">{bankInfo.accountName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nội dung chuyển khoản */}
              <div className="mt-4">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-3">
                  <div className="text-center">
                    <span className="text-gray-700 text-sm font-medium block mb-1">Nội dung chuyển khoản:</span>
                    <div className="bg-white border border-primary-300 rounded-md p-2">
                      <span className="font-mono font-bold text-primary-700 text-lg">{finalOrderId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-teal-500 rounded-lg p-4 mb-6 shadow-sm">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Hướng dẫn thanh toán
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">1</span>
                  <span className="text-sm text-teal-700">Mở app ngân hàng trên điện thoại</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">2</span>
                  <span className="text-sm text-teal-700">Quét mã QR ở bên trái</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center font-semibold">3</span>
                  <span className="text-sm text-teal-700">Xác nhận chuyển khoản và nhấn nút bên dưới</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <p className="text-gray-700 mb-6 font-medium">
                  Sau khi quét QR và chuyển khoản thành công, nhấn nút bên dưới để xác nhận
                </p>
                
                {errors.submit && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.submit}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed scale-95'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:ring-4 focus:ring-primary-300 hover:scale-105 shadow-lg hover:shadow-primary-600/30'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
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
              </div>
            </form>

            {/* Lưu ý quan trọng */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-yellow-800 font-medium text-sm mb-1">Lưu ý quan trọng</p>
                  <p className="text-yellow-700 text-xs leading-relaxed">
                    QR Code tự động điền đầy đủ thông tin chuyển khoản. Đơn hàng sẽ được xác nhận trong vòng 5-10 phút sau khi chuyển khoản thành công.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentForm 