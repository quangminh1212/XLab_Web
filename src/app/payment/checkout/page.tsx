'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { formatCurrency } from '@/lib/utils';
export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const productName = searchParams.get('product') || 'Sản phẩm không xác định';
  const amountString = searchParams.get('amount') || '0';
  const amount = parseInt(amountString, 10);
  const image = searchParams.get('image') || '/images/placeholder/product-placeholder.svg';

  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const total = Math.max(amount - couponDiscount, 0);

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
        setUserBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };
    fetchUserBalance();
  }, [session]);

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
        body: JSON.stringify({ 
          code: coupon,
          orderTotal: amount 
        }),
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

  const handlePayment = () => {
    router.push(`/account/deposit?amount=${total}&redirect=checkout`);
  };

  if (!productName || amount <= 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Thông tin thanh toán không hợp lệ</h1>
        <p className="mb-6">
          Không tìm thấy thông tin sản phẩm hoặc số tiền thanh toán không chính xác.
        </p>
        <Link
          href="/payment"
          className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
        >
          Quay lại trang thanh toán
        </Link>
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
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-xl font-bold mb-6">Chọn phương thức thanh toán</h2>
              <div className="space-y-4">
                {/* Thanh toán bằng số dư tài khoản */}
                <div className="border border-teal-300 rounded-lg p-4 bg-teal-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-teal-800">Số dư tài khoản</span>
                    <span className="text-teal-700 font-bold">
                      Số dư hiện tại: {formatCurrency(userBalance)}
                    </span>
                  </div>
                  {userBalance < total && !isLoadingBalance && (
                    <div className="mt-2 p-3 bg-teal-100 border border-teal-300 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-teal-500 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-teal-800">Số dư không đủ</h4>
                          <p className="text-sm text-teal-700 mt-1">
                            Bạn cần thêm{' '}
                            <span className="font-semibold">
                              {formatCurrency(total - userBalance)}
                            </span>{' '}
                            để hoàn tất đơn hàng này.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-teal-800 text-sm">
                  Hiện tại chúng tôi chỉ hỗ trợ thanh toán bằng số dư tài khoản để đảm bảo tính bảo
                  mật và xử lý nhanh chóng. Bạn có thể nạp tiền vào tài khoản thông qua các phương
                  thức chuyển khoản ngân hàng.
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>
                    {userBalance < total
                      ? `Nạp tiền (${formatCurrency(total - userBalance)})`
                      : `Thanh toán ${formatCurrency(total)}`}
                  </span>
                </button>
                {userBalance < total && (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 px-6 py-2 rounded font-medium cursor-not-allowed text-sm mt-2"
                  >
                    Thanh toán sẽ khả dụng sau khi nạp tiền
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h3>
            <div className="flex items-center mb-4">
              <Image
                src={image}
                alt={productName}
                width={56}
                height={56}
                className="rounded mr-3"
              />
              <div>
                <div className="font-semibold">{productName}</div>
                <div className="text-sm text-gray-500">Số lượng: 1</div>
              </div>
              <div className="ml-auto font-bold text-teal-700">{formatCurrency(amount)}</div>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm mb-2"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
              >
                {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
              </button>
              {couponError && <div className="text-red-500 text-xs mt-1">{couponError}</div>}
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tạm tính:</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Giảm giá:</span>
              <span className="text-red-600">-{formatCurrency(couponDiscount)}</span>
            </div>
            <div className="flex justify-between font-bold text-base mb-2">
              <span>Tổng cộng:</span>
              <span className="text-teal-700">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Số dư tài khoản:</span>
              <span>{formatCurrency(userBalance)}</span>
            </div>
            {userBalance < total && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Cần nạp thêm:</span>
                <span>{formatCurrency(total - userBalance)}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Bằng cách đặt hàng, bạn đồng ý với{' '}
              <Link href="/terms" className="underline">
                Điều khoản dịch vụ
              </Link>{' '}
              và{' '}
              <Link href="/privacy" className="underline">
                Chính sách bảo mật
              </Link>{' '}
              của chúng tôi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
