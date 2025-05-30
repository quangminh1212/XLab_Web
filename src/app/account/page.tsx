'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/common/Avatar'

// Khai báo các kiểu dữ liệu
interface OrderItem {
  id: string;
  name: string;
  version: string;
  price: number;
  originalPrice: number;
  licenseKey: string;
  expiryDate: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  totalAmount?: number; // Thêm trường totalAmount tùy chọn
  status: string;
  items: OrderItem[];
  couponDiscount?: number; // Thêm field để lưu số tiền giảm từ voucher
}

interface OrderHistory {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    id: string;
    name: string;
    version: string;
    price: number;
    originalPrice: number;
    licenseKey: string;
    expiryDate: string;
  }>;
  couponDiscount?: number;
  totalAmount?: number;
  createdAt?: string;
}

// This would normally come from a database or API
const userProfile = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: '/images/avatar-placeholder.svg',
  memberSince: '01/01/2023',
  licenseCount: 0, // Đặt thành 0 vì chưa có sản phẩm
  phone: '',
}

// Hàm tính toán hạn giấy phép dựa trên ngày mua và duration
const calculateExpiryDate = (purchaseDate: string | Date, duration: string): string => {
  const purchase = new Date(purchaseDate);
  let expiryDate = new Date(purchase);
  
  switch (duration) {
    case '1week':
      expiryDate.setDate(purchase.getDate() + 7);
      break;
    case '1month':
      expiryDate.setMonth(purchase.getMonth() + 1);
      break;
    case '3months':
      expiryDate.setMonth(purchase.getMonth() + 3);
      break;
    case '6months':
      expiryDate.setMonth(purchase.getMonth() + 6);
      break;
    case '1year':
      expiryDate.setFullYear(purchase.getFullYear() + 1);
      break;
    case '2years':
      expiryDate.setFullYear(purchase.getFullYear() + 2);
      break;
    case 'lifetime':
      return 'Vĩnh viễn';
    default:
      // Mặc định là 1 tháng nếu không có duration hoặc duration không hợp lệ
      expiryDate.setMonth(purchase.getMonth() + 1);
      break;
  }
  
  return expiryDate.toLocaleDateString('vi-VN');
};

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const [isSaving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [showPasswordMessage, setShowPasswordMessage] = useState(false);
  const [supportProduct, setSupportProduct] = useState('');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    productUpdates: true,
    promotions: true,
    expiryReminders: true
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  const formatCurrency = (amount: number) => {
    return currencyFormatter.format(amount);
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
      console.log('Session info: Name =', session.user.name, 'Email =', session.user.email, 'Image =', session.user.image);
      console.log('Google avatar URL:', session?.user?.image);
      
      // Khởi tạo thông tin cơ bản từ session
      const updatedProfile = {
        ...userProfile,
        name: session.user.name || userProfile.name,
        email: session.user.email || userProfile.email,
        avatar: session.user.image || '/images/avatar-placeholder.svg',
        // Sử dụng thông tin bổ sung từ session nếu có
        phone: session.user.phone || userProfile.phone,
        memberSince: session.user.memberSince || userProfile.memberSince,
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
              avatar: session.user.image || updatedProfile.avatar
            });
            console.log('Đã tải thông tin từ localStorage:', parsedProfile);
          }
        } else {
          // Nếu không có thông tin trong localStorage, sử dụng thông tin từ session
          setProfile(updatedProfile);
          console.log('Đã tải thông tin từ session');
        }

        // Tải cài đặt thông báo từ localStorage
        const savedNotificationSettings = localStorage.getItem(`notification_settings_${session.user.email}`);
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
            const localOrders = JSON.parse(localStorage.getItem(`orders_${session.user.email}`) || '[]');
            
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
                    const originalPrice = productData?.versions?.[0]?.originalPrice || 
                                        productData?.optionPrices?.[productData.defaultProductOption]?.originalPrice || 
                                        500000; // fallback

                    // Tính toán hạn giấy phép dựa trên ngày mua và duration từ sản phẩm
                    let duration = '1month'; // Mặc định
                    if (productData?.optionDurations && item.productOption) {
                      duration = productData.optionDurations[item.productOption] || '1month';
                    } else if (productData?.optionDurations && productData.defaultProductOption) {
                      duration = productData.optionDurations[productData.defaultProductOption] || '1month';
                    }
                    
                    const purchaseDate = new Date(apiOrder.createdAt);
                    const expiryDate = calculateExpiryDate(purchaseDate, duration);

                    return {
                      id: item.productId,
                      name: item.productName,
                      version: 'Premium',
                      price: item.price,
                      originalPrice: originalPrice,
                      licenseKey: `LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      expiryDate: expiryDate,
                    };
                  }),
                  couponDiscount: apiOrder.couponDiscount
                };
                allOrders.push(convertedOrder);
              }
            });
            
            // Sắp xếp theo ngày mới nhất
            allOrders.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
            
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

              const localOrders = JSON.parse(localStorage.getItem(`orders_${session.user.email}`) || '[]');
              const convertedOrders = localOrders.map((order: any) => ({
                id: order.id,
                date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
                total: order.totalAmount,
                status: order.status,
                items: order.items.map((item: any) => {
                  // Tìm sản phẩm trong dữ liệu products để lấy originalPrice chính xác
                  const productData = productsData.find((p: any) => p.id === item.productId);
                  const originalPrice = productData?.versions?.[0]?.originalPrice || 
                                      productData?.optionPrices?.[productData.defaultProductOption]?.originalPrice || 
                                      item.originalPrice || // Giữ originalPrice từ localStorage nếu có
                                      500000; // fallback cuối cùng

                  // Tính toán hạn giấy phép dựa trên ngày mua và duration từ sản phẩm
                  let duration = '1month'; // Mặc định
                  if (productData?.optionDurations && item.productOption) {
                    duration = productData.optionDurations[item.productOption] || '1month';
                  } else if (productData?.optionDurations && productData.defaultProductOption) {
                    duration = productData.optionDurations[productData.defaultProductOption] || '1month';
                  }
                  
                  const purchaseDate = new Date(order.createdAt);
                  const expiryDate = calculateExpiryDate(purchaseDate, duration);

                  return {
                    id: item.productId,
                    name: item.productName,
                    version: 'Premium',
                    price: item.price,
                    originalPrice: originalPrice,
                    licenseKey: `LIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    expiryDate: expiryDate,
                  };
                }),
                couponDiscount: order.couponDiscount
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
    setProfile(prev => ({
      ...prev,
      [name]: value
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
        localStorage.setItem(`user_profile_${session.user.email}`, JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          memberSince: profile.memberSince,
          // Không lưu email và avatar vì sẽ lấy từ session
        }));

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
          phone: profile.phone
        });

        console.log('Đã lưu thông tin vào localStorage và cập nhật session:', {
          name: profile.name,
          phone: profile.phone
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
  const totalSpent = purchaseHistory.reduce((sum, order) => {
    // Xử lý các trường hợp total có thể là totalAmount hoặc total
    const orderTotal = order.total || order.totalAmount || 0;
    // Đảm bảo giá trị là số và không phải NaN
    const validTotal = typeof orderTotal === 'number' && !isNaN(orderTotal) ? orderTotal : 0;
    return sum + validTotal;
  }, 0);

  // Tính tổng số tiền đã tiết kiệm (bao gồm cả tiết kiệm từ giá sale và voucher)
  const totalSaved = purchaseHistory.reduce((sum, order) => {
    // Tiết kiệm từ giá sale (originalPrice - price)
    const saleSavings = order.items.reduce((itemSum, item) => {
      const originalPrice = typeof item.originalPrice === 'number' && !isNaN(item.originalPrice) ? item.originalPrice : 0;
      const currentPrice = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      return itemSum + Math.max(0, originalPrice - currentPrice);
    }, 0);
    
    // Tiết kiệm từ voucher/coupon
    const voucherSavings = typeof order.couponDiscount === 'number' && !isNaN(order.couponDiscount) ? order.couponDiscount : 0;
    
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

  // Hàm xóa sản phẩm đã mua
  const handleDeletePurchase = (productId: string, orderId: string) => {
    // Tìm tên sản phẩm để hiển thị trong thông báo
    const order = purchaseHistory.find(o => o.id === orderId);
    const product = order?.items.find(item => item.id === productId);
    const productName = product?.name || 'sản phẩm này';
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${productName}" khỏi danh sách đã mua?\n\nLưu ý: Thao tác này không thể hoàn tác.`)) {
      // Xóa từ localStorage
      if (session?.user?.email) {
        const savedPurchases = localStorage.getItem(`orders_${session.user.email}`);
        if (savedPurchases) {
          try {
            const parsedPurchases = JSON.parse(savedPurchases);
            const updatedPurchases = parsedPurchases.map((order: any) => {
              if (order.id === orderId) {
                return {
                  ...order,
                  items: order.items.filter((item: any) => item.id !== productId)
                };
              }
              return order;
            }).filter((order: any) => order.items.length > 0); // Xóa đơn hàng nếu không còn item nào
            
            localStorage.setItem(`orders_${session.user.email}`, JSON.stringify(updatedPurchases));
            
            // Cập nhật state
            const updatedHistory = purchaseHistory.map(order => {
              if (order.id === orderId) {
                return {
                  ...order,
                  items: order.items.filter(item => item.id !== productId)
                };
              }
              return order;
            }).filter(order => order.items.length > 0);
            
            setPurchaseHistory(updatedHistory);
            
            // Hiển thị thông báo thành công
            alert(`Đã xóa "${productName}" khỏi danh sách sản phẩm đã mua thành công!`);
          } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            alert('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
          }
        }
      }
    }
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

  return (
    <div>
      {/* Page Header */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tài khoản của tôi</h1>
          <p className="text-xl max-w-3xl">
            Quản lý thông tin cá nhân, giấy phép và lịch sử mua hàng của bạn.
          </p>
        </div>
      </section>

      {/* Thống kê tổng quan */}
      <section className="py-8 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng sản phẩm đã mua</h3>
              <p className="text-3xl font-bold text-gray-800">
                {totalProducts}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                {hasProducts ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Tất cả đang hoạt động</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Chưa có sản phẩm nào</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng số tiền đã thanh toán</h3>
              <p className="text-3xl font-bold text-gray-800 whitespace-nowrap">{formatCurrency(totalSpent)}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Qua {purchaseHistory.length} đơn hàng</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng số tiền đã tiết kiệm</h3>
              <p className="text-3xl font-bold text-green-600 whitespace-nowrap">{formatCurrency(totalSaved)}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v.5a.5.5 0 001 0V12zm0-5a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3A.5.5 0 0010 6z" clipRule="evenodd" />
                </svg>
                <span>So với giá gốc</span>
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
                    <Avatar
                      src={session?.user?.image}
                      alt={profile.name}
                      size="xl"
                      className=""
                    />
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
                            setProfile(prev => ({ ...prev, avatar: imageUrl }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-sm text-gray-500">Thành viên từ {profile.memberSince}</p>
                </div>

                <nav className="space-y-1">
                  <a href="#profile" className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hồ sơ cá nhân
                  </a>
                  <a href="#my-products" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Sản phẩm của tôi
                  </a>
                  <a href="#licenses" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Quản lý giấy phép
                  </a>
                  <a href="#orders" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Lịch sử mua hàng
                  </a>
                  <a href="#downloads" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống
                  </a>
                  <a href="#support" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Hỗ trợ kỹ thuật
                  </a>
                  <a href="#settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt tài khoản
                  </a>
                </nav>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Giấy phép đang hoạt động</span>
                    <span className="font-bold">{totalProducts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đơn hàng đã mua</span>
                    <span className="font-bold">{purchaseHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng sản phẩm</span>
                    <span className="font-bold">{totalProducts}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Phần Hồ sơ cá nhân */}
              <div id="profile" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Thông tin cá nhân</h3>
                    <form onSubmit={handleUpdateProfile}>
                      {saveSuccess && (
                        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
                          Thông tin đã được cập nhật thành công!
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                          <input
                            type="text"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            value={profile.name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-100"
                            value={profile.email}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tham gia</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 bg-gray-100"
                            value={profile.memberSince}
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                          <input
                            type="text"
                            name="phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Chưa cập nhật"
                            value={profile.phone}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>

                      <div className="mt-4 text-right">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isSaving ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Đổi mật khẩu</h3>
                    {showPasswordMessage && (
                      <div className="mb-4 p-3 bg-blue-50 text-blue-600 text-sm rounded-md flex items-start justify-between">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{passwordMessage}</span>
                        </div>
                        <button 
                          onClick={() => setShowPasswordMessage(false)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                        <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500" />
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      <button 
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          setPasswordMessage('Tính năng đổi mật khẩu chỉ hoạt động cho tài khoản đăng ký bằng email/mật khẩu. Tài khoản Google không hỗ trợ thay đổi mật khẩu qua trang này.');
                          setShowPasswordMessage(true);
                        }}
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần Sản phẩm đã mua */}
              <div id="my-products" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm đã mua</h2>

                {hasProducts ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchaseHistory.flatMap(order => 
                      order.items.map((item, index) => (
                        <div key={`${order.id}-${item.id}-${index}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="p-4">
                            {/* Header của card với nút xóa */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.version}</p>
                              </div>
                              <button 
                                onClick={() => handleDeletePurchase(item.id, order.id)}
                                className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Xóa sản phẩm"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Giá</span>
                                <span className="font-semibold">{formatCurrency(item.price)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Tiết kiệm từ giá sale</span>
                                <span className="font-semibold text-green-600">{formatCurrency(item.originalPrice - item.price)}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Ngày mua</span>
                                <span className="font-semibold">{order.date || '--'}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Hạn giấy phép</span>
                                <span className="font-semibold">{item.expiryDate || '--'}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <button className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-md text-sm hover:bg-teal-700 transition">
                                Tải xuống
                              </button>
                              <button className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-300 transition">
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Bạn chưa mua sản phẩm nào. Khám phá các sản phẩm của chúng tôi để bắt đầu.</p>
                    <Link href="/products" className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Khám phá sản phẩm
                    </Link>
                  </div>
                )}
              </div>

              {/* Phần Quản lý giấy phép */}
              <div id="licenses" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Quản lý giấy phép</h2>

                {hasProducts ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giấy phép</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kích hoạt</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn sử dụng</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {purchaseHistory.flatMap(order => order.items).map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.version}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono">{item.licenseKey}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {purchaseHistory.map(order => {
                                if (order.items.some(orderItem => orderItem.id === item.id)) {
                                  return (
                                    <div key={`license-date-${order.id}-${item.id}`} className="text-sm text-gray-900">
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
                                Đang hoạt động
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button className="text-primary-600 hover:text-primary-900">Sao chép</button>
                                <button className="text-blue-600 hover:text-blue-900">Gia hạn</button>
                                <button 
                                  onClick={() => {
                                    // Tìm order chứa item này
                                    const order = purchaseHistory.find(o => o.items.some(i => i.id === item.id));
                                    if (order) {
                                      handleDeletePurchase(item.id, order.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Xóa
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có giấy phép nào</h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">Bạn chưa có giấy phép sản phẩm nào. Hãy mua sản phẩm để nhận giấy phép.</p>
                  </div>
                )}
              </div>

              {/* Phần Lịch sử mua hàng */}
              <div id="orders" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  Lịch sử mua hàng
                  {hasProducts && (
                    <button 
                      onClick={goToOrdersPage}
                      className="ml-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Xem tất cả đơn hàng
                    </button>
                  )}
                </h2>

                {hasProducts ? (
                  <div className="space-y-2">
                    {purchaseHistory.map((order, orderIndex) => (
                      <div key={orderIndex} className="border rounded-lg overflow-hidden">
                        {/* Dòng 1: Tất cả thông tin chính */}
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center space-x-4 flex-1">
                            <span className="font-bold text-sm">#{order.id}</span>
                            <span className="text-xs text-gray-600">{order.date}</span>
                            <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">{order.status}</span>
                            <div className="flex items-center space-x-2">
                              {order.items.map((item, itemIndex) => (
                                <span key={itemIndex} className="text-sm">
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-600 mx-1">•</span>
                                  <span className="text-primary-600">{formatCurrency(item.price)}</span>
                                  <button 
                                    onClick={() => handleDeletePurchase(item.id, order.id)}
                                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                                    title="Xóa"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 text-sm">
                            <span className="text-green-600 font-medium">
                              -{formatCurrency(order.items.reduce((sum, item) => sum + (item.originalPrice - item.price), 0) + (order.couponDiscount || 0))}
                            </span>
                            <span className="font-bold">{formatCurrency(order.total)}</span>
                            <Link 
                              href={`/orders/${order.id}`}
                              className="text-primary-600 hover:text-primary-800 text-xs"
                            >
                              Chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center mt-4">
                      <button 
                        onClick={goToOrdersPage}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Xem tất cả đơn hàng →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Bạn chưa thực hiện giao dịch nào. Hãy khám phá sản phẩm của chúng tôi.</p>
                    <Link href="/products" className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Mua sắm ngay
                    </Link>
                  </div>
                )}
              </div>

              {/* Phần Tải xuống */}
              <div id="downloads" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Tải xuống</h2>

                {hasProducts ? (
                  <div className="space-y-4">
                    {purchaseHistory.flatMap(order => order.items).map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-3 md:mb-0">
                          <h3 className="font-bold">{item.name} - {item.version}</h3>
                          <p className="text-sm text-gray-600">Phiên bản: 2.1.0 (Cập nhật: 01/07/2023)</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Xem lịch sử
                          </button>
                          <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Tải xuống
                          </button>
                          <button 
                            onClick={() => {
                              // Tìm order chứa item này
                              const order = purchaseHistory.find(o => o.items.some(i => i.id === item.id));
                              if (order) {
                                handleDeletePurchase(item.id, order.id);
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có tệp nào để tải xuống</h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto">Bạn cần mua sản phẩm trước khi có thể tải xuống phần mềm.</p>
                  </div>
                )}
              </div>

              {/* Phần Hỗ trợ kỹ thuật */}
              <div id="support" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Hỗ trợ kỹ thuật</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-lg mb-2">Yêu cầu hỗ trợ mới</h3>
                    <p className="text-gray-600 mb-4">Gửi yêu cầu hỗ trợ kỹ thuật cho sản phẩm bạn đã mua</p>

                    {supportSuccess && (
                      <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md flex items-start justify-between">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Yêu cầu hỗ trợ của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.</span>
                        </div>
                        <button 
                          onClick={() => setSupportSuccess(false)}
                          className="text-green-400 hover:text-green-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          value={supportProduct}
                          onChange={(e) => setSupportProduct(e.target.value)}
                        >
                          <option value="">Chọn sản phẩm cần hỗ trợ</option>
                          {purchaseHistory.flatMap(order => order.items).map((item, index) => (
                            <option key={index} value={item.id}>{item.name} - {item.version}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="Nhập tiêu đề vấn đề" 
                          value={supportTitle}
                          onChange={(e) => setSupportTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả vấn đề</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[120px]"
                          placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải"
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
                            alert('Vui lòng nhập đầy đủ thông tin');
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
                        Gửi yêu cầu hỗ trợ
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần Cài đặt tài khoản */}
              <div id="settings" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Cài đặt tài khoản</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-lg mb-3">Thông báo</h3>
                    
                    {settingsSaved && (
                      <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md flex items-start justify-between">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Cài đặt thông báo đã được lưu thành công!</span>
                        </div>
                        <button 
                          onClick={() => setSettingsSaved(false)}
                          className="text-green-400 hover:text-green-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo qua email</span>
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                            checked={notificationSettings.email}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              email: e.target.checked
                            })}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo cập nhật sản phẩm</span>
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                            checked={notificationSettings.productUpdates}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              productUpdates: e.target.checked
                            })}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo khuyến mãi và ưu đãi</span>
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                            checked={notificationSettings.promotions}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              promotions: e.target.checked
                            })}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo hết hạn giấy phép</span>
                        <label className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" 
                            checked={notificationSettings.expiryReminders}
                            onChange={(e) => setNotificationSettings({
                              ...notificationSettings,
                              expiryReminders: e.target.checked
                            })}
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
                            JSON.stringify(notificationSettings)
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
                      Lưu thay đổi
                    </button>
                  </div>
                </div>

                {/* Nút đăng xuất */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">Đăng xuất</h3>
                      <p className="text-sm text-gray-600 mt-1">Kết thúc phiên đăng nhập hiện tại của bạn</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 