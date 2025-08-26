'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { useCart } from '@/components/cart/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateCartTotals, formatCurrency } from '@/lib/utils';
// import { generateDetailedOrderId } from '@/shared/utils/orderUtils';


import products from '../../data/products.json';

export default function CheckoutPage() {
  const { items: cartItems } = useCart();
  const router = useRouter();
  // const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { language, t } = useLanguage();

  // Luôn bắt đầu với bước 2 (thanh toán)
  const [_step, _setStep] = useState(2);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'vietnam',
  });
  const [_errors, _setErrors] = useState<Record<string, string>>({});
  const [_selectedPaymentMethod] = useState<
    'balance' | 'bank' | 'momo' | 'zalopay'
  >('balance');
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  // Điền thông tin từ tài khoản đã đăng nhập
  useEffect(() => {
    if (session?.user) {
      const email = session.user.email || '';
      const name = session.user.name || '';
      
      // Tách họ và tên từ tên đầy đủ (nếu có)
      const nameParts = name.split(' ');
      const lastName = nameParts.pop() || '';
      const firstName = nameParts.join(' ') || '';
      
      setShippingInfo(prev => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        email: email || prev.email,
      }));
    }
  }, [session]);

  // Chuyển đổi items thành định dạng phù hợp với calculateCartTotals
  const cart = cartItems.map((item) => {
    // Tìm sản phẩm tương ứng trong danh sách products
    const productDetail = products.find((p: any) => {
      const productId = String(p.id).toLowerCase();
      const itemId = String(item.id).toLowerCase();
      const productName = String(p.name).toLowerCase();
      const itemName = String(item.name).toLowerCase();
      return (
        productId === itemId ||
        productId === itemName ||
        productName === itemId ||
        productName === itemName ||
        p.slug === itemId ||
        p.slug === itemName
      );
    });
    let imageUrl = '/images/placeholder/product-placeholder.svg';
    if (
      productDetail?.images &&
      Array.isArray(productDetail.images) &&
      productDetail.images.length > 0
    ) {
      const imagesArr = productDetail.images as string[];
      imageUrl = imagesArr[0] ?? imageUrl;
    } else if (item.image && !item.image.includes('placeholder')) {
      imageUrl = item.image;
    }
    return {
      ...item,
      image: imageUrl,
    };
  });

  // Calculate cart totals
  const { subtotal } = calculateCartTotals(cart);
  const total = subtotal;

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

    _setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const _handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const _handleSubmitShippingInfo = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateShippingInfo()) {
      _setStep(2);
    }
  };

  const handlePayment = () => {
    // Chỉ hỗ trợ thanh toán bằng số dư tài khoản
    router.push(`/account/deposit?amount=${total}&redirect=checkout`);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-teal-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-0 sm:px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('checkout.title')}</h1>
          <p className="text-base md:text-lg max-w-3xl">
            {t('checkout.subtitle')}
          </p>
        </div>
      </section>

      {/* Checkout Process */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-0 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Column - Payment Methods */}
            <div className="lg:w-2/3">
              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-xl font-bold mb-6">{t('checkout.paymentMethods')}</h2>

                <div className="space-y-4">
                  {/* Thanh toán bằng số dư tài khoản - PHƯƠNG THỨC DUY NHẤT */}
                  <div
                    className={`border-2 rounded-lg p-4 ${userBalance >= total ? 'border-teal-600 bg-teal-50' : 'border-teal-400 bg-teal-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${userBalance >= total ? 'border-teal-600 bg-teal-600' : 'border-teal-400 bg-teal-400'}`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold">{t('checkout.accountBalance')}</h3>
                          <p className="text-sm text-gray-600">
                            {isLoadingBalance ? (
                              t('checkout.checkingBalance')
                            ) : (
                              <>
                                {t('checkout.currentBalance')}{' '}
                                <span className="font-semibold">
                                  {formatCurrency(userBalance, language)}
                                </span>
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
                            <h4 className="text-sm font-medium text-teal-800">{t('checkout.insufficientBalance')}</h4>
                            <p className="text-sm text-teal-700 mt-1">
                              {t('checkout.needMore', {
                                amount: formatCurrency(total - userBalance, language)
                              })}
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
                        <svg
                          className="w-5 h-5 text-teal-500 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-teal-800">
                          {t('checkout.simpleSecure')}
                        </h4>
                        <p className="text-sm text-teal-700 mt-1">
                          {t('checkout.supportInfo')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  {/* Hiển thị nút khác nhau tùy theo số dư */}
                  {isLoadingBalance ? (
                    <button
                      disabled
                      className="flex-1 bg-gray-400 text-white px-6 py-3 rounded font-medium cursor-not-allowed"
                    >
                      {t('checkout.checkingBalance')}
                    </button>
                  ) : userBalance >= total ? (
                    <button
                      onClick={handlePayment}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded font-medium transition-colors"
                    >
                      {t('checkout.pay', { amount: formatCurrency(total, language) })}
                    </button>
                  ) : (
                    <div className="flex-1 space-y-3">
                      <button
                        onClick={() =>
                          router.push(`/account/deposit?amount=${total}&redirect=checkout`)
                        }
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>{t('checkout.topUp', { amount: formatCurrency(total - userBalance, language) })}</span>
                      </button>
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 px-6 py-2 rounded font-medium cursor-not-allowed text-sm"
                      >
                        {t('checkout.availableAfterTopUp')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>

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
                        <p className="text-gray-500 text-xs">{t('cart.quantity')}: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-sm">
                        {formatCurrency(item.price * item.quantity, language)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('checkout.subtotal')}</span>
                    <span>{formatCurrency(subtotal, language)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>{t('checkout.total')}</span>
                    <span className="text-teal-600">{formatCurrency(total, language)}</span>
                  </div>

                  {/* Hiển thị thông tin số dư */}
                  {session?.user && (
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span>{t('checkout.accountBalanceStatus')}</span>
                        <span
                          className={
                            isLoadingBalance
                              ? 'text-gray-500'
                              : userBalance >= total
                                ? 'text-green-600'
                                : 'text-teal-600'
                          }
                        >
                          {isLoadingBalance ? t('checkout.checkingBalance') : formatCurrency(userBalance, language)}
                        </span>
                      </div>
                      {!isLoadingBalance && userBalance < total && (
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-teal-600">{t('checkout.needToTopUp')}</span>
                          <span className="text-teal-600 font-semibold">
                            {formatCurrency(total - userBalance, language)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    {t('checkout.termsAgreement', {
                      terms: (
                        <Link href="/terms" className="text-teal-600 hover:underline">
                          {t('checkout.terms')}
                        </Link>
                      ),
                      privacy: (
                        <Link href="/privacy" className="text-teal-600 hover:underline">
                          {t('checkout.privacy')}
                        </Link>
                      ),
                    })}
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
