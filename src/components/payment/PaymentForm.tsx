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

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-blue-500 text-white">
        <h2 className="text-2xl font-bold">Thanh toán an toàn</h2>
        <p className="mt-1 text-blue-100">Hoàn tất đơn hàng của bạn</p>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <div className="font-semibold text-lg mb-2">Chi tiết thanh toán</div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Tổng thanh toán:</span>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(amount)}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="font-semibold mb-3">Phương thức thanh toán</div>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
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
              
              <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
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
              
              <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
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
            <>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Số thẻ
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trên thẻ
                </label>
                <input
                  type="text"
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="NGUYEN VAN A"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.cardName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </>
          )}
          
          {paymentMethod === 'momo' && (
            <div className="py-4 text-center">
              <p className="text-gray-600 mb-4">
                Quét mã QR bằng ứng dụng MoMo để thanh toán
              </p>
              <div className="inline-block bg-white p-3 border rounded-lg">
                <Image 
                  src="/images/placeholder/momo-qr.png" 
                  alt="MoMo QR Code" 
                  width={200} 
                  height={200} 
                  className="mx-auto" 
                />
              </div>
            </div>
          )}
          
          {paymentMethod === 'banking' && (
            <div className="py-4">
              <p className="text-gray-600 mb-4">
                Vui lòng chuyển khoản đến tài khoản ngân hàng sau:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="mb-2">
                  <span className="font-medium">Ngân hàng:</span> Vietcombank
                </p>
                <p className="mb-2">
                  <span className="font-medium">Số tài khoản:</span> 1234567890
                </p>
                <p className="mb-2">
                  <span className="font-medium">Chủ tài khoản:</span> {siteConfig.legal.companyName}
                </p>
                <p className="mb-0">
                  <span className="font-medium">Nội dung chuyển khoản:</span> {orderId}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Sau khi chuyển khoản thành công, vui lòng nhấn nút "Hoàn tất thanh toán" bên dưới.
              </p>
            </div>
          )}
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Hoàn tất thanh toán'
            )}
          </button>
        </form>
        
        <div className="mt-6 flex items-center justify-center">
          <div className="flex space-x-4">
            <Image src="/images/payment/visa.svg" alt="Visa" width={40} height={24} />
            <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={40} height={24} />
            <Image src="/images/payment/momo.svg" alt="MoMo" width={36} height={24} />
            <Image src="/images/payment/zalopay.svg" alt="ZaloPay" width={40} height={24} />
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          Thông tin thanh toán của bạn được bảo mật và mã hóa
        </div>
      </div>
    </div>
  )
}

export default PaymentForm 