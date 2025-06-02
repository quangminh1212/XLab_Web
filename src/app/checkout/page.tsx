"use client";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/cart/CartContext'
import { calculateCartTotals, formatCurrency } from '@/lib/utils'
import { generateDetailedOrderId } from '@/shared/utils/orderUtils'
import { useSession } from 'next-auth/react'
import products from '@/data/products.json'

export default function CheckoutPage() {
  const { items: cartItems, clearCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const skipInfo = searchParams?.get('skipInfo') === 'true'
  const { data: session } = useSession()
  
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'balance' | 'bank' | 'momo' | 'zalopay'>('balance');
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  
  // Chuyển đổi items thành định dạng phù hợp với calculateCartTotals
  const cart = cartItems.map(item => {
    // Tìm sản phẩm tương ứng trong danh sách products
    const productDetail = products.find((p: any) => {
      const productId = String(p.id).toLowerCase();
      const itemId = String(item.id).toLowerCase();
      const productName = String(p.name).toLowerCase();
      const itemName = String(item.name).toLowerCase();
      return productId === itemId || productId === itemName || productName === itemId || productName === itemName || p.slug === itemId || p.slug === itemName;
    });
    let imageUrl = '/images/placeholder/product-placeholder.svg';
    if (productDetail?.images && Array.isArray(productDetail.images) && productDetail.images.length > 0) {
      const imagesArr = productDetail.images as string[];
      imageUrl = imagesArr[0];
    } else if (item.image && !item.image.includes('placeholder')) {
      imageUrl = item.image;
    }
    return {
      ...item,
      image: imageUrl
    };
  });
  
  // Calculate cart totals
  const { subtotal, tax } = calculateCartTotals(cart);
  const total = Math.max(subtotal - couponDiscount, 0);

  // Cập nhật step khi tham số URL thay đổi
  useEffect(() => {
    if (skipInfo) {
      setStep(2);
    }
  }, [skipInfo]);

  // Lấy số dư người dùng
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!session?.user?.email) {
        setIsLoadingBalance(false);
        return;
      }

      try {
        const response = await fetch('/api/user/balance');
        if (response.ok) {
          const data = await response.json();
          setUserBalance(data.balance || 0);
        }
      } catch (error) {
        console.error('Error fetching user balance:', error);
        setUserBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchUserBalance();
  }, [session]);

  // Lấy danh sách mã giảm giá đang sở hữu (giả lập: lấy tất cả mã active)
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch('/api/cart/validate-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'ALL' }) // code đặc biệt để trả về tất cả mã
        });
        const data = await res.json();
        if (data.allCoupons) {
          setAvailableCoupons(data.allCoupons);
        } else {
          // fallback: hardcode các mã mẫu nếu API chưa hỗ trợ
          setAvailableCoupons([
            { code: 'WELCOME50', name: 'Chào mừng thành viên mới', description: 'Giảm 50.000đ cho đơn từ 200.000đ', type: 'fixed', value: 50000 },
            { code: 'WELCOME10', name: 'Giảm 10% cho đơn hàng đầu tiên', description: 'Ưu đãi cho khách hàng mới', type: 'percentage', value: 10 },
            { code: 'FREESHIP', name: 'Miễn phí vận chuyển', description: 'Miễn phí vận chuyển (30.000đ)', type: 'fixed', value: 30000 },
            { code: 'XLAB20', name: 'Giảm 20% cho sản phẩm XLab', description: 'Giảm 20% cho các sản phẩm XLab', type: 'percentage', value: 20 }
          ]);
        }
      } catch (err) {
        setAvailableCoupons([
          { code: 'WELCOME50', name: 'Chào mừng thành viên mới', description: 'Giảm 50.000đ cho đơn từ 200.000đ', type: 'fixed', value: 50000 },
          { code: 'WELCOME10', name: 'Giảm 10% cho đơn hàng đầu tiên', description: 'Ưu đãi cho khách hàng mới', type: 'percentage', value: 10 },
          { code: 'FREESHIP', name: 'Miễn phí vận chuyển', description: 'Miễn phí vận chuyển (30.000đ)', type: 'fixed', value: 30000 },
          { code: 'XLAB20', name: 'Giảm 20% cho sản phẩm XLab', description: 'Giảm 20% cho các sản phẩm XLab', type: 'percentage', value: 20 }
        ]);
      }
    };
    fetchCoupons();
  }, []);

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

  const handlePayment = () => {
    // Chỉ hỗ trợ thanh toán bằng số dư tài khoản
    router.push(`/account/deposit?amount=${total}&redirect=checkout`);
  };

  // Hàm áp dụng mã giảm giá
  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    setCouponError('');
    setCouponDiscount(0);
    if (!coupon.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      setIsApplyingCoupon(false);
      return;
    }
    try {
      const res = await fetch('/api/cart/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon })
      });
      const data = await res.json();
      if (res.ok && data.discount) {
        setCouponDiscount(data.discount);
        setCouponError('');
      } else {
        setCouponDiscount(0);
        setCouponError(data.message || 'Mã giảm giá không hợp lệ');
      }
    } catch (err) {
      setCouponDiscount(0);
      setCouponError('Có lỗi xảy ra, thử lại sau.');
    }
    setIsApplyingCoupon(false);
  };

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
            {/* Left Column - Information or Payment Methods */}
            <div className="lg:w-2/3">
              {step === 1 ? (
                /* Billing Information */
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
              ) : (
                /* Payment Methods */
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <h2 className="text-xl font-bold mb-6">Chọn phương thức thanh toán</h2>
                  
                  <div className="space-y-4">
                    {/* Thanh toán bằng số dư tài khoản - PHƯƠNG THỨC DUY NHẤT */}
                    <div className={`border-2 rounded-lg p-4 ${userBalance >= total ? 'border-teal-600 bg-teal-50' : 'border-teal-400 bg-teal-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${userBalance >= total ? 'border-teal-600 bg-teal-600' : 'border-teal-400 bg-teal-400'}`}>
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          </div>
                          <div>
                            <h3 className="font-semibold">Số dư tài khoản</h3>
                            <p className="text-sm text-gray-600">
                              {isLoadingBalance ? (
                                'Đang tải số dư...'
                              ) : (
                                <>
                                  Số dư hiện tại: <span className="font-semibold">{formatCurrency(userBalance)}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">💰</span>
                        </div>
                      </div>
                      
                      {/* Thông báo số dư không đủ */}
                      {!isLoadingBalance && userBalance < total && (
                        <div className="mt-4 p-3 bg-teal-100 border border-teal-300 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-teal-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-teal-800">Số dư không đủ</h4>
                              <p className="text-sm text-teal-700 mt-1">
                                Bạn cần thêm <span className="font-semibold">{formatCurrency(total - userBalance)}</span> để hoàn tất đơn hàng này.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Thông báo phương thức thanh toán */}
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-teal-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-teal-800">Thanh toán đơn giản và an toàn</h4>
                          <p className="text-sm text-teal-700 mt-1">
                            Hiện tại chúng tôi chỉ hỗ trợ thanh toán bằng số dư tài khoản để đảm bảo tính bảo mật và xử lý nhanh chóng. 
                            Bạn có thể nạp tiền vào tài khoản thông qua các phương thức chuyển khoản ngân hàng.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-4">
                    {!skipInfo && (
                      <button
                        onClick={() => setStep(1)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded font-medium transition-colors"
                      >
                        Quay lại
                      </button>
                    )}
                    
                    {/* Hiển thị nút khác nhau tùy theo số dư */}
                    {isLoadingBalance ? (
                      <button
                        disabled
                        className="flex-1 bg-gray-400 text-white px-6 py-3 rounded font-medium cursor-not-allowed"
                      >
                        Đang kiểm tra số dư...
                      </button>
                    ) : userBalance >= total ? (
                      <button
                        onClick={handlePayment}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-medium transition-colors"
                      >
                        Thanh toán {formatCurrency(total)}
                      </button>
                    ) : (
                      <div className="flex-1 space-y-3">
                        <button
                          onClick={() => router.push(`/account/deposit?amount=${total}&redirect=checkout`)}
                          className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Nạp tiền ({formatCurrency(total - userBalance)})</span>
                        </button>
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 px-6 py-2 rounded font-medium cursor-not-allowed text-sm"
                        >
                          Thanh toán sẽ khả dụng sau khi nạp tiền
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded flex-shrink-0 flex items-center justify-center">
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
                
                {/* Nhập mã giảm giá */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="border rounded px-3 py-2 text-sm flex-grow min-w-0"
                      placeholder="Nhập mã giảm giá"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      disabled={isApplyingCoupon}
                    />
                    <button
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon}
                    >
                      Áp dụng
                    </button>
                  </div>
                  {couponError && <div className="text-red-500 text-xs mt-1">{couponError}</div>}
                  {couponDiscount > 0 && <div className="text-green-600 text-xs mt-1">Đã áp dụng mã, giảm {formatCurrency(couponDiscount)}</div>}
                  {availableCoupons.length > 0 && (
                    <div className="mt-3 bg-teal-50 border border-teal-200 rounded p-3">
                      <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
                        Mã giảm giá đang sở hữu:
                      </div>
                      <ul className="space-y-1 text-sm">
                        {availableCoupons.map(c => (
                          <li key={c.code} className="flex items-center gap-2">
                            <span className="font-mono text-teal-700 bg-white border border-teal-200 rounded px-2 py-0.5 text-xs">{c.code}</span>
                            <span className="font-medium text-teal-900">{c.name}</span>
                            <span className="text-teal-700">- {c.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Tổng cộng:</span>
                    <span className="text-teal-600">{formatCurrency(total)}</span>
                  </div>
                  
                  {/* Hiển thị thông tin số dư */}
                  {session?.user && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Số dư tài khoản:</span>
                        <span className={isLoadingBalance ? 'text-gray-500' : userBalance >= total ? 'text-green-600' : 'text-teal-600'}>
                          {isLoadingBalance ? 'Đang tải...' : formatCurrency(userBalance)}
                        </span>
                      </div>
                      {!isLoadingBalance && userBalance < total && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-teal-600">Cần nạp thêm:</span>
                          <span className="text-teal-600 font-semibold">{formatCurrency(total - userBalance)}</span>
                        </div>
                      )}
                    </div>
                  )}
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