"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartContext'
import { calculateCartTotals, formatCurrency } from '@/lib/utils'
import PaymentForm from '@/components/payment/PaymentForm'
import { generateDetailedOrderId } from '@/shared/utils/orderUtils'

export default function CheckoutPage() {
  const { items: cartItems, clearCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const skipInfo = searchParams?.get('skipInfo') === 'true'
  
  // Mặc định là bước 1 (thông tin), nhưng nếu có tham số skipInfo=true thì chuyển thẳng bước 2 (thanh toán)
  const [step, setStep] = useState(skipInfo ? 2 : 1);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'vietnam',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Chuyển đổi items thành định dạng phù hợp với calculateCartTotals
  const cart = cartItems.map(item => ({
    ...item,
    image: item.image || '/images/product-placeholder.svg'
  }));
  
  // Calculate cart totals
  const { subtotal, tax, total } = calculateCartTotals(cart);

  // Cập nhật step khi tham số URL thay đổi
  useEffect(() => {
    if (skipInfo) {
      setStep(2);
    }
  }, [skipInfo]);

  const validateShippingInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập họ';
    }
    
    if (!shippingInfo.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập tên';
    }
    
    if (!shippingInfo.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    }
    
    if (!shippingInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    
    if (!shippingInfo.city.trim()) {
      newErrors.city = 'Vui lòng nhập thành phố';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitShippingInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateShippingInfo()) {
      setStep(2);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    // Redirect to success page
    const productNames = cart.map(item => item.name).join(', ');
    router.push(`/payment/success?product=${encodeURIComponent(productNames)}&amount=${total}`);
    
    // Clear cart after successful payment
    clearCart();
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Thanh toán</h1>
          <p className="text-base md:text-lg max-w-3xl">
            Hoàn tất đơn hàng của bạn với các phương thức thanh toán an toàn.
          </p>
        </div>
      </section>

      {/* Checkout Process */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Checkout Steps - Hiển thị chỉ khi không bỏ qua bước thông tin */}
          {!skipInfo && (
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className={`flex flex-col items-center ${step === 1 ? 'text-primary-600' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${step === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="text-sm">Thông tin</span>
                </div>
                <div className={`w-16 md:w-24 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${step === 2 ? 'text-primary-600' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${step === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="text-sm">Thanh toán</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Billing Information or Payment Form */}
            <div className="lg:w-2/3">
              {step === 1 ? (
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>
                  
                  <form onSubmit={handleSubmitShippingInfo} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block mb-1 font-medium text-sm">
                          Họ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleShippingInfoChange}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block mb-1 font-medium text-sm">
                          Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleShippingInfoChange}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-1 font-medium text-sm">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingInfoChange}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className="block mb-1 font-medium text-sm">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingInfoChange}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block mb-1 font-medium text-sm">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingInfoChange}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="city" className="block mb-1 font-medium text-sm">
                          Thành phố <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingInfoChange}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="country" className="block mb-1 font-medium text-sm">
                          Quốc gia <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleShippingInfoChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-600"
                        >
                          <option value="vietnam">Việt Nam</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded font-medium transition-colors"
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <PaymentForm 
                  amount={total} 
                  productName={cart.map(item => item.name).join(', ')}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => console.error(error)}
                />
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="flex py-4 first:pt-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="max-w-full h-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/product-placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold">{item.name}</h3>
                        {'version' in item && <p className="text-gray-600 text-sm">Phiên bản: {(item as any).version}</p>}
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600 text-sm">x{item.quantity}</span>
                          <span className="font-semibold text-primary-600">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary-600">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                {step === 1 && (
                  <div className="mt-6">
                    <Link href="/cart" className="flex items-center text-primary-600 hover:text-primary-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Quay lại giỏ hàng
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 