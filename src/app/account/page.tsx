'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/common/Avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency, convertCurrency } from '@/shared/utils/formatCurrency';

// Khai báo các kiểu dữ liệu
interface OrderItem {
  id: string;
  name: string;
  version: string;
  price: number;
  originalPrice: number;
  licenseKey: string;
  expiryDate: string;
  quantity?: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  couponDiscount?: number; // Thêm field để lưu số tiền giảm từ voucher
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '/images/avatar-placeholder.svg',
    memberSince: new Date().toLocaleDateString('vi-VN'),
    licenseCount: 0,
    phone: '',
  });
  const [isSaving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supportProduct, setSupportProduct] = useState('');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    productUpdates: true,
    promotions: true,
    expiryReminders: true,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [publicCoupons, setPublicCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const { t, language } = useLanguage();

  // Hàm lấy danh sách mã giảm giá
  const fetchAvailableCoupons = async () => {
    try {
      const res = await fetch('/api/cart/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'ALL' }), // code đặc biệt để trả về tất cả mã
      });
      const data = await res.json();
      if (data.allCoupons) {
        setAvailableCoupons(data.allCoupons);
      }
    } catch (error) {
      console.error('Error fetching available coupons:', error);
    }
  };

  // Hàm lấy danh sách mã giảm giá công khai
  const fetchPublicCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const res = await fetch('/api/coupons/public');
      const data = await res.json();
      if (data.success && data.coupons) {
        setPublicCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching public coupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    // Chuyển hướng người dùng nếu chưa đăng nhập
    if (status === 'unauthenticated') {
      console.log('User is not authenticated, redirecting to login page');
      router.push('/login?callbackUrl=/account');
      return;
    }

    if (status === 'loading') {
      console.log('Session loading...');
      return;
    }

    // Nếu người dùng đã xác thực
    if (status === 'authenticated' && session?.user) {
      console.log('User is authenticated, loading profile data:', session.user);
      console.log(
        'Session info: Name =',
        session.user.name,
        'Email =',
        session.user.email,
        'Image =',
        session.user.image,
      );
      console.log('Google avatar URL:', session?.user?.image);

      // Khởi tạo thông tin cơ bản từ session
      const updatedProfile = {
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || '/images/avatar-placeholder.svg',
        memberSince: session.user.memberSince || new Date().toLocaleDateString('vi-VN'),
        licenseCount: 0,
        phone: session.user.phone || '',
      };

      // Kiểm tra xem có thông tin đã lưu trong localStorage không
      try {
        const savedProfile = localStorage.getItem(`user_profile_${session.user.email}`);
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);

          // Nếu session có customName = true, ưu tiên sử dụng name từ session
          if (session.user.customName) {
            setProfile({
              ...updatedProfile,
              // Lấy một số thông tin từ localStorage nếu cần
              phone: parsedProfile.phone || updatedProfile.phone,
            });
            console.log('Đã tải thông tin từ session (tên tùy chỉnh)');
          } else {
            // Ngược lại, kết hợp thông tin từ localStorage và session
            setProfile({
              ...updatedProfile,
              ...parsedProfile,
              email: session.user.email || updatedProfile.email,
              avatar: session.user.image || updatedProfile.avatar,
            });
            console.log('Đã tải thông tin từ localStorage:', parsedProfile);
          }
        } else {
          // Nếu không có thông tin trong localStorage, sử dụng thông tin từ session
          setProfile(updatedProfile);
          console.log('Đã tải thông tin từ session');
        }

        // Tải cài đặt thông báo từ localStorage
        const savedNotificationSettings = localStorage.getItem(
          `notification_settings_${session.user.email}`,
        );
        if (savedNotificationSettings) {
          try {
            const parsedSettings = JSON.parse(savedNotificationSettings);
            setNotificationSettings(parsedSettings);
            console.log('Đã tải cài đặt thông báo:', parsedSettings);
          } catch (error) {
            console.error('Lỗi khi parse cài đặt thông báo:', error);
          }
        }

        // Fetch real purchase history from API và localStorage
        (async () => {
          try {
            // Lấy dữ liệu sản phẩm để có thông tin originalPrice chính xác
            const productsRes = await fetch('/api/products', { cache: 'no-store' });
            let productsData = [];
            if (productsRes.ok) {
              const data = await productsRes.json();
              productsData = data.products || [];
            }

            // Lấy đơn hàng từ localStorage
            const localOrders = JSON.parse(
              localStorage.getItem(`orders_${session.user.email}`) || '[]',
            );

            // Lấy đơn hàng từ API
            const res = await fetch('/api/orders/history', { cache: 'no-store' });
            let apiOrders = [];

            if (res.ok) {
              const data = await res.json();
              apiOrders = data.orders || [];
            }

            // Kết hợp dữ liệu từ localStorage và API, ưu tiên localStorage
            const allOrders = [...localOrders];

            // Thêm các đơn hàng từ API nếu chưa có trong localStorage
            apiOrders.forEach((apiOrder: any) => {
              const exists = localOrders.some((localOrder: any) => localOrder.id === apiOrder.id);
              if (!exists) {
                // Chuyển đổi format từ API sang format component
                const convertedOrder = {
                  id: apiOrder.id,
                  date: new Date(apiOrder.createdAt).toLocaleDateString('vi-VN'),
                  total: apiOrder.totalAmount,
                  status: apiOrder.status,
                  items: apiOrder.items.map((item: any) => {
                    // Tìm sản phẩm trong dữ liệu products để lấy originalPrice chính xác
                    const productData = productsData.find((p: any) => p.id === item.productId);
                    const originalPrice =
                      productData?.versions?.[0]?.originalPrice ||
                      productData?.optionPrices?.[productData.defaultProductOption]
                        ?.originalPrice ||
                      500000; // fallback

                    return {
                      id: item.productId,
                      name: item.productName,
                      version: 'Premium',
                      price: item.price,
                      originalPrice: originalPrice,
                      licenseKey: `LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      expiryDate: new Date(
                        Date.now() + 365 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString('vi-VN'), // 1 năm
                    };
                  }),
                  couponDiscount: apiOrder.couponDiscount,
                };
                allOrders.push(convertedOrder);
              }
            });

            // Sắp xếp theo ngày mới nhất
            allOrders.sort(
              (a, b) =>
                new Date(b.date || b.createdAt).getTime() -
                new Date(a.date || a.createdAt).getTime(),
            );

            setPurchaseHistory(allOrders);
            console.log('Combined orders:', allOrders);
          } catch (err) {
            console.error('Error fetching purchase history:', err);
            // Fallback: chỉ đọc từ localStorage, vẫn cần fetch dữ liệu sản phẩm để tính originalPrice
            try {
              // Vẫn cần lấy dữ liệu sản phẩm cho fallback
              const productsRes = await fetch('/api/products', { cache: 'no-store' });
              let productsData = [];
              if (productsRes.ok) {
                const data = await productsRes.json();
                productsData = data.products || [];
              }

              const localOrders = JSON.parse(
                localStorage.getItem(`orders_${session.user.email}`) || '[]',
              );
              const convertedOrders = localOrders.map((order: any) => ({
                id: order.id,
                date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
                total: order.totalAmount,
                status: order.status,
                items: order.items.map((item: any) => {
                  // Tìm sản phẩm trong dữ liệu products để lấy originalPrice chính xác
                  const productData = productsData.find((p: any) => p.id === item.productId);
                  const originalPrice =
                    productData?.versions?.[0]?.originalPrice ||
                    productData?.optionPrices?.[productData.defaultProductOption]?.originalPrice ||
                    item.originalPrice || // Giữ originalPrice từ localStorage nếu có
                    500000; // fallback cuối cùng

                  return {
                    id: item.productId,
                    name: item.productName,
                    version: 'Premium',
                    price: item.price,
                    originalPrice: originalPrice,
                    licenseKey: `LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(
                      'vi-VN',
                    ),
                  };
                }),
                couponDiscount: order.couponDiscount,
              }));
              setPurchaseHistory(convertedOrders);
            } catch (localErr) {
              console.error('Error reading from localStorage:', localErr);
              setPurchaseHistory([]);
            }
          } finally {
            setIsLoading(false);
          }
        })();

        fetchAvailableCoupons(); // Thêm dòng này để lấy danh sách mã giảm giá
        fetchPublicCoupons(); // Thêm dòng này để lấy danh sách mã giảm giá công khai
      } catch (error) {
        console.error('Lỗi khi đọc từ localStorage:', error);
        // Fallback to session data
        setProfile(updatedProfile);
        setIsLoading(false);
      }
    }
  }, [status, router, session]);

  // Hàm xử lý khi thay đổi thông tin
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSaveSuccess(false);
  };

  // Hàm xử lý khi submit form cập nhật thông tin
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Lưu thông tin vào localStorage
      if (session?.user?.email) {
        localStorage.setItem(
          `user_profile_${session.user.email}`,
          JSON.stringify({
            name: profile.name,
            phone: profile.phone,
            memberSince: profile.memberSince,
            // Không lưu email và avatar vì sẽ lấy từ session
          }),
        );

        // Cập nhật thông tin trong session (trong môi trường thực tế sẽ gọi API)
        /* Trong thực tế, bạn cần gọi API để cập nhật thông tin người dùng:
        const response = await fetch('/api/user/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: session.user.email,
            name: profile.name,
            phone: profile.phone 
          })
        });
        const data = await response.json();
        */

        // Cập nhật session để khi refresh trang sẽ giữ nguyên thông tin
        await updateSession({
          name: profile.name,
          phone: profile.phone,
        });

        console.log('Đã lưu thông tin vào localStorage và cập nhật session:', {
          name: profile.name,
          phone: profile.phone,
        });
      }

      setSaving(false);
      setSaveSuccess(true);

      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Lỗi khi lưu thông tin:', error);
      setSaving(false);
      // Xử lý thông báo lỗi ở đây nếu cần
    }
  };

  // Hàm định dạng ngày
  const formatDate = (dateString: string) => {
    // Giả sử định dạng đầu vào là DD/MM/YYYY
    return dateString;
  };

  // Thêm liên kết đến trang đơn hàng
  const goToOrdersPage = () => {
    router.push('/orders');
  };

  // Tính tổng số tiền đã chi
  const totalSpent = purchaseHistory.reduce((sum, order) => sum + order.total, 0);

  // Tính tổng số tiền đã tiết kiệm (bao gồm cả tiết kiệm từ giá sale và voucher)
  const totalSaved = purchaseHistory.reduce((sum, order) => {
    // Tiết kiệm từ giá sale (originalPrice - price)
    const saleSavings = order.items.reduce((itemSum, item) => {
      return itemSum + (item.originalPrice - item.price);
    }, 0);

    // Tiết kiệm từ voucher/coupon
    const voucherSavings = order.couponDiscount || 0;

    return sum + saleSavings + voucherSavings;
  }, 0);

  // Xử lý lỗi hình ảnh
  const handleImageError = () => {
    setImageError(true);
    console.log('Lỗi khi tải ảnh đại diện, sử dụng ảnh mặc định');
  };

  // Hàm xử lý đăng xuất
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Kiểm tra nếu có sản phẩm đã mua hay không
  const hasProducts = purchaseHistory.length > 0;

  // Tổng số sản phẩm
  const totalProducts = purchaseHistory.reduce((sum, order) => sum + order.items.length, 0);

  // Use the language-aware formatter
  const formattedTotalSpent = formatCurrency(convertCurrency(totalSpent, language), language);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('account.myAccount')}</h1>
          <p className="text-xl max-w-3xl">
            {t('account.manageInfo')}
          </p>
        </div>
      </section>

      {/* Thống kê tổng quan */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">{t('account.totalProducts')}</h3>
              <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                {hasProducts ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('account.allActive')}</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t('account.noProducts')}</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">{t('account.totalPaid')}</h3>
              <p className="text-3xl font-bold text-gray-800 whitespace-nowrap">
                {formattedTotalSpent}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t('account.throughOrders', { count: purchaseHistory.length })}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">{t('account.totalSaved')}</h3>
              <p className="text-3xl font-bold text-green-600 whitespace-nowrap">
                {formatCurrency(convertCurrency(totalSaved, language), language)}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v.5a.5.5 0 001 0V12zm0-5a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3A.5.5 0 0010 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t('account.comparedToOriginal')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Dashboard */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-4">
                    <Avatar src={session?.user?.image} alt={profile.name} size="xl" className="" />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Tạo URL ảnh tạm thời
                            const imageUrl = URL.createObjectURL(file);
                            // Trong thực tế, bạn sẽ upload ảnh lên server ở đây
                            // Và cập nhật session và profile với URL mới
                            setProfile((prev) => ({ ...prev, avatar: imageUrl }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-sm text-gray-500">{t('account.memberSince', { date: profile.memberSince })}</p>
                </div>

                <nav className="space-y-1">
                  <a
                    href="#profile"
                    className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {t('account.profile')}
                  </a>
                  <a
                    href="#my-products"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    {t('account.myProducts')}
                  </a>

                  <a
                    href="#licenses"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    {t('account.licenses')}
                  </a>
                  <a
                    href="#orders"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    {t('account.orders')}
                  </a>
                  <a
                    href="#downloads"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    {t('account.downloads')}
                  </a>
                  <a
                    href="#support"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {t('account.support')}
                  </a>
                  <a
                    href="#settings"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t('account.settings')}
                  </a>
                </nav>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">{t('account.quickStats')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('account.activeLicenses')}</span>
                    <span className="font-bold">{totalProducts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('account.purchasedOrders')}</span>
                    <span className="font-bold">{purchaseHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('account.totalProducts')}</span>
                    <span className="font-bold">{totalProducts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Phần Hồ sơ cá nhân */}
              <div id="profile" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('account.profile')}</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('account.personalInfo')}</h3>
                    <form onSubmit={handleUpdateProfile} className="mb-8">
                      {saveSuccess && (
                        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
                          {t('account.infoUpdated')}
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('account.fullName')}
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={profile.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('account.email')}
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-100"
                            value={profile.email}
                            disabled
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('account.phone')}
                          </label>
                          <input
                            type="text"
                            name="phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder={t('account.notUpdated')}
                            value={profile.phone}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className={`px-6 py-2.5 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition flex items-center ${
                            isSaving ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSaving ? (
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : null}
                          {isSaving ? t('account.saving') : t('account.updateInfo')}
                        </button>
                      </div>
                    </form>
                  </div>


                </div>
              </div>

              


              {/* Phần Sản phẩm đã mua */}
              <div id="my-products" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('account.purchasedProducts')}</h2>

                {hasProducts ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchaseHistory
                      .flatMap((order) => order.items)
                      .map((item, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b">
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.version}</p>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">{t('account.price')}</span>
                              <span className="font-semibold">{formatCurrency(convertCurrency(item.price, language), language)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">{t('account.quantity')}</span>
                              <span className="font-semibold">{item.quantity || 1}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">{t('account.savingsFromSale')}</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(convertCurrency(item.originalPrice - item.price, language), language)}
                              </span>
                            </div>
                            {/* Tìm order chứa item hiện tại để hiển thị ngày mua */}
                            {purchaseHistory.map((order) => {
                              if (order.items.some((orderItem) => orderItem.id === item.id)) {
                                return (
                                  <div
                                    key={`purchase-date-${order.id}-${item.id}`}
                                    className="flex justify-between items-center mb-2"
                                  >
                                    <span className="text-gray-600">{t('account.purchaseDate')}</span>
                                    <span className="font-semibold">{order.date}</span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                            {/* Tìm order chứa item hiện tại và hiển thị voucher discount */}
                            {purchaseHistory.map((order) => {
                              if (
                                order.items.some((orderItem) => orderItem.id === item.id) &&
                                order.couponDiscount &&
                                order.couponDiscount > 0
                              ) {
                                return (
                                  <div
                                    key={`voucher-${order.id}-${item.id}`}
                                    className="flex justify-between items-center mb-2"
                                  >
                                    <span className="text-gray-600">{t('account.savingsFromVoucher')}</span>
                                    <span className="font-semibold text-green-600">
                                      {formatCurrency(convertCurrency(order.couponDiscount, language), language)}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">{t('account.licenseExpiry')}</span>
                              <span className="font-semibold">{item.expiryDate}</span>
                            </div>
                            <div className="mt-4 flex space-x-2">
                              <button className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 transition">
                                {t('account.download')}
                              </button>
                              <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition">
                                {t('account.viewDetails')}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {t('account.noProducts')}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {t('account.noProductsDescription')}
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {t('account.exploreProducts')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Phần Quản lý giấy phép */}
              <div id="licenses" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('account.licenses')}</h2>

                {hasProducts ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.product')}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.licenseKey')}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.quantity')}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.activationDate')}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.expiryDate')}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.status')}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {t('account.actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {purchaseHistory
                          .flatMap((order) => order.items)
                          .map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-gray-500">{item.version}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 font-mono">
                                  {item.licenseKey}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {item.quantity || 1}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {purchaseHistory.map((order) => {
                                  if (order.items.some((orderItem) => orderItem.id === item.id)) {
                                    return (
                                      <div
                                        key={`license-date-${order.id}-${item.id}`}
                                        className="text-sm text-gray-900"
                                      >
                                        {order.date}
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{item.expiryDate}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {t('account.active')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <button className="text-primary-600 hover:text-primary-900">
                                    {t('account.copy')}
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-900">
                                    {t('account.extend')}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {t('account.noLicenses')}
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                      {t('account.noLicensesDescription')}
                    </p>
                  </div>
                )}
              </div>

              {/* Phần Lịch sử mua hàng */}
              <div id="orders" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {t('account.purchaseHistory')}
                  {hasProducts && (
                    <button
                      onClick={goToOrdersPage}
                      className="ml-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      {t('account.viewAllOrders')}
                    </button>
                  )}
                </h2>

                {hasProducts ? (
                  <div className="space-y-6">
                    {purchaseHistory.map((order, orderIndex) => (
                      <div key={orderIndex} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{t('account.order', { id: order.id })}</h3>
                            <p className="text-sm text-gray-600">{t('account.orderDate', { date: order.date })}</p>
                          </div>
                          <div>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-4">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="space-y-1">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.version}</div>
                                  <div className="text-sm text-gray-500">
                                    {t('account.quantity')}: {item.quantity || 1}
                                  </div>
                                </div>
                                <div className="text-right mt-2 sm:mt-0">
                                  <div className="font-semibold">{formatCurrency(convertCurrency(item.price, language), language)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 border-t pt-4">
                            {/* Hiển thị chi tiết tiết kiệm */}
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">{t('account.savingsFromSale')}:</span>
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(
                                    convertCurrency(
                                      order.items.reduce(
                                        (sum, item) => sum + (item.originalPrice - item.price),
                                        0,
                                      ),
                                      language
                                    ),
                                    language
                                  )}
                                </span>
                              </div>
                              {order.couponDiscount && order.couponDiscount > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">{t('account.savingsFromVoucher')}:</span>
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(convertCurrency(order.couponDiscount, language), language)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm font-bold border-t pt-2">
                                <span className="text-gray-800">{t('account.totalSavings')}:</span>
                                <span className="text-green-600">
                                  {formatCurrency(
                                    convertCurrency(
                                      order.items.reduce(
                                        (sum, item) => sum + (item.originalPrice - item.price),
                                        0,
                                      ) + (order.couponDiscount || 0),
                                      language
                                    ),
                                    language
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-lg font-semibold">
                                {t('account.totalPayment', { amount: formatCurrency(convertCurrency(order.total, language), language) })}
                              </div>
                              <div className="flex space-x-3">
                                <Link
                                  href={`/orders/${order.id}`}
                                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm"
                                >
                                  {t('account.viewOrder')}
                                </Link>
                                <button className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm">
                                  {t('account.downloadPDF')}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="text-center mt-6">
                      <button
                        onClick={goToOrdersPage}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        {t('account.viewAllOrders')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {t('account.noOrders')}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {t('account.noOrdersDescription')}
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {t('account.buyNow')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Phần Tải xuống */}
              <div id="downloads" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('account.downloads')}</h2>

                {hasProducts ? (
                  <div className="space-y-4">
                    {purchaseHistory
                      .flatMap((order) => order.items)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:shadow-md transition flex flex-col md:flex-row md:justify-between md:items-center"
                        >
                          <div className="mb-3 md:mb-0">
                            <h3 className="font-bold">
                              {item.name} - {item.version}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t('account.version', { version: '2.1.0' })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              {t('account.viewHistory')}
                            </button>
                            <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              {t('account.download')}
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {t('account.noDownloads')}
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">
                      {t('account.noDownloadsDescription')}
                    </p>
                  </div>
                )}
              </div>

              {/* Phần Hỗ trợ kỹ thuật */}
              <div id="support" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('account.support')}</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-lg mb-2">{t('account.newRequest')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('account.supportDescription')}
                    </p>

                    {supportSuccess && (
                      <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md flex items-start justify-between">
                        <div className="flex items-start">
                          <svg
                            className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{t('account.requestSuccess')}</span>
                        </div>
                        <button
                          onClick={() => setSupportSuccess(false)}
                          className="text-green-400 hover:text-green-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('account.product')}
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          value={supportProduct}
                          onChange={(e) => setSupportProduct(e.target.value)}
                        >
                          <option value="">{t('account.selectProduct')}</option>
                          {purchaseHistory
                            .flatMap((order) => order.items)
                            .map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name} - {item.version}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('account.title')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder={t('account.enterTitle')}
                          value={supportTitle}
                          onChange={(e) => setSupportTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('account.description')}
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[120px]"
                          placeholder={t('account.enterDescription')}
                          value={supportDescription}
                          onChange={(e) => setSupportDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      <button
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          // Validate form
                          if (!supportTitle || !supportDescription) {
                            alert(t('account.formValidation'));
                            return;
                          }

                          // Reset form
                          setSupportProduct('');
                          setSupportTitle('');
                          setSupportDescription('');
                          setSupportSuccess(true);

                          // Tự động ẩn thông báo sau 5 giây
                          setTimeout(() => {
                            setSupportSuccess(false);
                          }, 5000);
                        }}
                      >
                        {t('account.submitRequest')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần Cài đặt tài khoản */}
              <div id="settings" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('account.settings')}</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-lg mb-3">{t('account.notifications')}</h3>

                    {settingsSaved && (
                      <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md flex items-start justify-between">
                        <div className="flex items-start">
                          <svg
                            className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{t('account.settingsSaved')}</span>
                        </div>
                        <button
                          onClick={() => setSettingsSaved(false)}
                          className="text-green-400 hover:text-green-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{t('account.emailNotifications')}</span>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                            checked={notificationSettings.email}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                email: e.target.checked,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{t('account.productUpdates')}</span>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                            checked={notificationSettings.productUpdates}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                productUpdates: e.target.checked,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{t('account.promotions')}</span>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                            checked={notificationSettings.promotions}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                promotions: e.target.checked,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{t('account.expiryReminders')}</span>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                            checked={notificationSettings.expiryReminders}
                            onChange={(e) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                expiryReminders: e.target.checked,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <button
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                      onClick={(e) => {
                        e.preventDefault();

                        // Lưu cài đặt vào localStorage
                        if (session?.user?.email) {
                          localStorage.setItem(
                            `notification_settings_${session.user.email}`,
                            JSON.stringify(notificationSettings),
                          );
                        }

                        // Hiển thị thông báo thành công
                        setSettingsSaved(true);

                        // Tự động ẩn thông báo sau 3 giây
                        setTimeout(() => {
                          setSettingsSaved(false);
                        }, 3000);
                      }}
                    >
                      {t('account.saveChanges')}
                    </button>
                  </div>
                </div>

                {/* Nút đăng xuất */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{t('account.logout')}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('account.endSession')}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      {t('account.logout')}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
