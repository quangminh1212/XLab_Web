'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

interface PaymentFormProps {
  amount: number
  productName?: string
  orderId?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

const PaymentForm = ({ 
  amount, 
  productName,
  orderId = `ORDER-${Date.now()}`,
  onSuccess,
  onError 
}: PaymentFormProps) => {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [cardName, setCardName] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<string>('')
  const [cvv, setCvv] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  }

  const formatCardNumber = (value: string) => {
    const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g
    const onlyNumbers = value.replace(/[^\d]/g, '')
    
    return onlyNumbers.replace(regex, (_, p1, p2, p3, p4) => {
      let result = ''
      if (p1) result += p1
      if (p2) result += ' ' + p2
      if (p3) result += ' ' + p3
      if (p4) result += ' ' + p4
      return result
    }).trim()
  }

  const formatExpiryDate = (value: string) => {
    const onlyNumbers = value.replace(/[^\d]/g, '')
    
    if (onlyNumbers.length <= 2) {
      return onlyNumbers
    }
    
    return `${onlyNumbers.slice(0, 2)}/${onlyNumbers.slice(2, 4)}`
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setExpiryDate(formatted)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Vui lòng nhập số thẻ'
      } else if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Số thẻ không hợp lệ'
      }
      
      if (!cardName.trim()) {
        newErrors.cardName = 'Vui lòng nhập tên trên thẻ'
      }
      
      if (!expiryDate.trim()) {
        newErrors.expiryDate = 'Vui lòng nhập ngày hết hạn'
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Ngày hết hạn không hợp lệ'
      }
      
      if (!cvv.trim()) {
        newErrors.cvv = 'Vui lòng nhập mã CVV'
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = 'Mã CVV không hợp lệ'
      }
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
      // Giả lập call API thanh toán
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
      
      const errorMessage = 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'
      
      if (onError) {
        onError(errorMessage)
      } else {
        setErrors({ submit: errorMessage })
      }
    }
  }

  // Thông tin MoMo - fallback nếu không có trong siteConfig
  const momoPhone = '0901234567';

  // Thông tin ngân hàng - fallback nếu không có trong siteConfig
  const bankInfo = {
    bankName: 'Vietcombank',
    accountName: siteConfig.legal.companyName,
    accountNumber: '1234567890'
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-primary-500 text-white">
        <h2 className="text-2xl font-bold">Thanh toán an toàn</h2>
        <p className="mt-1 text-primary-100">Hoàn tất đơn hàng của bạn</p>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <div className="font-semibold text-lg mb-2">Chi tiết thanh toán</div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Tổng thanh toán:</span>
            <span className="text-xl font-bold text-primary-600">{formatCurrency(amount)}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="font-semibold mb-3">Phương thức thanh toán</div>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card" 
                  className="sr-only"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <Image src="/images/icons/credit-card.svg" alt="Credit Card" width={40} height={40} className="mb-2" />
                <span className="text-sm font-medium">Thẻ tín dụng</span>
              </label>
              
              <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="momo" 
                  className="sr-only"
                  checked={paymentMethod === 'momo'}
                  onChange={() => setPaymentMethod('momo')}
                />
                <Image src="/images/icons/momo.svg" alt="MoMo" width={40} height={40} className="mb-2" />
                <span className="text-sm font-medium">MoMo</span>
              </label>
              
              <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="banking" 
                  className="sr-only"
                  checked={paymentMethod === 'banking'}
                  onChange={() => setPaymentMethod('banking')}
                />
                <Image src="/images/icons/bank-transfer.svg" alt="Bank Transfer" width={40} height={40} className="mb-2" />
                <span className="text-sm font-medium">Chuyển khoản</span>
              </label>
            </div>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Số thẻ
                </label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Image src="/images/payment/visa.svg" alt="Visa" width={25} height={15} className="h-5 w-auto" />
                    <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={25} height={15} className="h-5 w-auto" />
                  </div>
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trên thẻ
                </label>
                <input
                  id="cardName"
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="NGUYEN VAN A"
                  className={`w-full border ${errors.cardName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.cardName && (
                  <p className="mt-1 text-xs text-red-600">{errors.cardName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'momo' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-center">
                <Image src="/images/payment/momo-qr.png" alt="MoMo QR Code" width={200} height={200} className="mx-auto mb-4" />
                <p className="text-gray-700 mb-2">Quét mã QR bằng ứng dụng MoMo</p>
                <div className="text-primary-500 font-bold text-xl mb-2">{formatCurrency(amount)}</div>
                <p className="text-xs text-gray-500">Hoặc chuyển khoản đến SĐT: {momoPhone}</p>
                <p className="text-xs text-gray-500 mt-1">Nội dung chuyển khoản: {orderId}</p>
              </div>
            </div>
          )}
          
          {paymentMethod === 'banking' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Thông tin chuyển khoản</h3>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Ngân hàng:</span> {bankInfo.bankName}</p>
                <p><span className="font-medium">Chủ tài khoản:</span> {bankInfo.accountName}</p>
                <p><span className="font-medium">Số tài khoản:</span> {bankInfo.accountNumber}</p>
                <p><span className="font-medium">Số tiền:</span> <span className="text-primary-600 font-bold">{formatCurrency(amount)}</span></p>
                <p><span className="font-medium">Nội dung chuyển khoản:</span> <span className="text-primary-600">{orderId}</span></p>
              </div>
              
              <div className="mt-4 p-3 bg-primary-50 text-sm rounded">
                <p className="mb-1 font-medium">Lưu ý:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Vui lòng nhập chính xác nội dung chuyển khoản</li>
                  <li>Chụp lại biên lai chuyển khoản để hỗ trợ tra soát khi cần</li>
                  <li>Đơn hàng sẽ được xác nhận trong vòng 24h sau khi thanh toán thành công</li>
                </ul>
              </div>
            </div>
          )}
          
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
              {errors.submit}
            </div>
          )}
          
          <div className="mt-6">
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
                  Đang xử lý...
                </div>
              ) : (
                'Xác nhận thanh toán'
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Thông tin thanh toán của bạn được bảo mật và mã hóa
            </p>
            <div className="flex items-center justify-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-500">Bảo mật SSL</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentForm 