"use client";

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'

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
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

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
        const qrContent = `2|99|${bankInfo.bankCode}|${bankInfo.accountNumber}|${bankInfo.accountName}|${amount}|${orderId}|VN`;
        
        const qrCodeDataUrl = await QRCode.toDataURL(qrContent, {
          width: 300,
          margin: 2,
          color: {
            dark: '#00A19A', // Màu XLab
            light: '#FFFFFF'
          }
        });
        
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('Lỗi tạo QR code:', error);
      }
    };

    generateQRCode();
  }, [amount, orderId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const transactionId = `TXN-${Date.now()}`
      
      setIsLoading(false)
      
      if (onSuccess) {
        onSuccess(transactionId)
      } else {
        router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}`)
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
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 6v6m8-9a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Thanh toán QR Code</h2>
            <p className="text-primary-100 text-sm">Quét mã để chuyển khoản nhanh chóng</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tổng tiền */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-primary-800 font-medium">Tổng thanh toán:</span>
            <span className="text-2xl font-bold text-primary-700">{formatCurrency(amount)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Cột trái - QR Code */}
          <div>
            <div className="bg-white border-2 border-primary-200 rounded-lg p-6 mb-6 shadow-sm text-center">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 6v6m8-9a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
                Quét mã QR để chuyển khoản
              </h3>
              
              {qrCodeUrl ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                    <img src={qrCodeUrl} alt="QR Code chuyển khoản" className="w-64 h-64 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Mở app ngân hàng của bạn và quét mã QR này
                  </p>
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              )}
            </div>

            {/* Thông tin ngân hàng backup */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6" />
                </svg>
                Thông tin chuyển khoản (nếu không quét được QR)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số TK:</span>
                  <span className="font-mono font-bold text-primary-600">{bankInfo.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ TK:</span>
                  <span className="font-medium">{bankInfo.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-primary-600">{formatCurrency(amount)}</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600 block mb-1">Nội dung:</span>
                  <div className="bg-primary-50 border border-primary-200 rounded-md p-2 text-center">
                    <span className="font-mono font-bold text-primary-700">{orderId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải - Xác nhận và Hướng dẫn */}
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6 shadow-sm">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Thông tin đơn hàng
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Mã đơn hàng:</span>
                  <span className="font-mono text-sm text-green-800">{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Tổng tiền:</span>
                  <span className="font-bold text-lg text-green-800">{formatCurrency(amount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-teal-500 rounded-lg p-4 mb-6 shadow-sm">
              <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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