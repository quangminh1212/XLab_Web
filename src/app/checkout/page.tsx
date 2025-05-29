"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartContext'
import { calculateCartTotals, formatCurrency } from '@/lib/utils'
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

  // Redirect to deposit page for payment
  useEffect(() => {
    if (step === 2) {
      const productNames = cart.map(item => item.name).join(', ');
      router.push(`/account/deposit?amount=${total}`);
    }
  }, [step, total, cart, router]);

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

  // If on payment step, component will redirect to deposit page
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng đến trang thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-teal-600 text-white py-8 md:py-12">
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
                <div className={`flex flex-col items-center ${step === 1 ? 'text-teal-600' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${step === 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="text-sm">Thông tin</span>
                </div>
                <div className={`w-16 md:w-24 h-1 mx-2 ${step >= 2 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${step === 2 ? 'text-teal-600' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${step === 2 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="text-sm">Thanh toán</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Billing Information */}
            <div className="lg:w-2/3">
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
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="country" className="block mb-1 font-medium text-sm">
                        Quốc gia
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingInfoChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600"
                      >
                        <option value="vietnam">Việt Nam</option>
                        <option value="singapore">Singapore</option>
                        <option value="thailand">Thái Lan</option>
                        <option value="malaysia">Malaysia</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded font-medium transition-colors"
                    >
                      Tiếp tục thanh toán
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={item.image || '/images/product-placeholder.svg'}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-gray-500 text-xs">Số lượng: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Thuế VAT:</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-teal-600">{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Bằng cách đặt hàng, bạn đồng ý với{' '}
                    <Link href="/terms" className="text-teal-600 hover:underline">
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link href="/privacy" className="text-teal-600 hover:underline">
                      Chính sách bảo mật
                    </Link>{' '}
                    của chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 