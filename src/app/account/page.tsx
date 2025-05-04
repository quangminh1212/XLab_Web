'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useIsomorphicLayoutEffect } from '@/lib/hooks'

// Kiểu cho item trong purchaseHistory
interface PurchaseItem {
  id: string;
  name: string;
  version: string;
  price: number;
  licenseKey: string;
  expiryDate: string;
}

// Kiểu cho order trong purchaseHistory
interface PurchaseOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: PurchaseItem[];
}

// Dữ liệu mẫu cho lịch sử đơn hàng
const purchaseHistory: PurchaseOrder[] = [
  {
    id: 'ORD-12345',
    date: '15/03/2023',
    total: 4990000,
    status: 'Hoàn thành',
    items: [
      {
        id: 'business-suite',
        name: 'XLab Business Suite',
        version: 'Chuyên nghiệp',
        price: 4990000,
        licenseKey: 'XLAB-BS-PRO-1234-5678-90AB',
        expiryDate: '15/03/2024',
      }
    ]
  },
  {
    id: 'ORD-12346',
    date: '20/04/2023',
    total: 3980000,
    status: 'Hoàn thành',
    items: [
      {
        id: 'security-pro',
        name: 'XLab Security Pro',
        version: 'Cơ bản',
        price: 1990000,
        licenseKey: 'XLAB-SP-BAS-2345-6789-01CD',
        expiryDate: '20/04/2024',
      },
      {
        id: 'design-master',
        name: 'XLab Design Master',
        version: 'Tiêu chuẩn',
        price: 1990000,
        licenseKey: 'XLAB-DM-STD-3456-7890-12EF',
        expiryDate: '20/04/2024',
      }
    ]
  }
]

// Types cho components
interface ProfileTabProps {
  session: Session | null;
}

interface OrdersTabProps {
  purchaseHistory: PurchaseOrder[];
  formatCurrency: (amount: number) => string;
}

// Component con đã được memoized
const ProfileTab = memo<ProfileTabProps>(({ session }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
        <input
          type="text"
          id="fullName"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          placeholder="Nhập họ và tên"
          defaultValue={session?.user?.name || ''}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          placeholder="Nhập email"
          defaultValue={session?.user?.email || ''}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
        <input
          type="tel"
          id="phone"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Công ty / Tổ chức</label>
        <input
          type="text"
          id="company"
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
          placeholder="Nhập tên công ty/tổ chức (nếu có)"
        />
      </div>
    </div>
    
    <div className="mt-6">
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
      <textarea
        id="address"
        rows={3}
        className="px-4 py-2 border border-gray-300 rounded-md w-full"
        placeholder="Nhập địa chỉ của bạn"
      ></textarea>
    </div>
    
    <div className="mt-6 flex justify-end">
      <button
        type="button"
        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
      >
        Cập nhật thông tin
      </button>
    </div>
  </div>
));

ProfileTab.displayName = 'ProfileTab';

// Tối ưu render bằng component con đã được memo
const OrdersTab = memo<OrdersTabProps>(({ purchaseHistory, formatCurrency }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
    <h2 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h2>
    
    {purchaseHistory.length > 0 ? (
      <div className="space-y-6">
        {purchaseHistory.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
              <div>
                <span className="font-semibold">Đơn hàng {order.id}</span>
                <span className="text-gray-500 text-sm ml-3">{order.date}</span>
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              {order.items.map((item) => (
                <div key={item.id} className="mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">Phiên bản: {item.version}</p>
                      <p className="text-sm text-gray-500">Mã giấy phép: {item.licenseKey}</p>
                      <p className="text-sm text-gray-500">Hiệu lực đến: {item.expiryDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-semibold">Tổng cộng:</span>
                <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t flex justify-end space-x-2">
              <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm">
                Xem hóa đơn
              </button>
              <button className="px-3 py-1 bg-teal-100 text-teal-800 rounded hover:bg-teal-200 transition-colors text-sm">
                Tải xuống sản phẩm
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có đơn hàng nào</h3>
        <p className="text-gray-500 mb-6">Bạn chưa thực hiện giao dịch mua sản phẩm nào.</p>
        <Link
          href="/products"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors inline-block"
        >
          Xem sản phẩm
        </Link>
      </div>
    )}
  </div>
));

OrdersTab.displayName = 'OrdersTab';

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      router.push('/login?callbackUrl=' + encodeURIComponent('/account'));
    },
  });
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [imageError, setImageError] = useState(false);
  
  // Xác nhận rằng code đang chạy ở phía client và đọc tab từ URL
  useEffect(() => {
    setIsClient(true);
    
    // Đọc tham số tab từ URL query
    const tabFromUrl = searchParams?.get('tab');
    if (tabFromUrl && ['profile', 'orders', 'licenses', 'downloads', 'support'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
      // Lưu tab hiện tại vào localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accountActiveTab', tabFromUrl);
        }
      } catch (error) {
        console.error('Không thể lưu tab vào localStorage:', error);
      }
    } else {
      // Nếu không có tab trong URL, thử đọc từ localStorage
      try {
        if (typeof window !== 'undefined') {
          const savedTab = localStorage.getItem('accountActiveTab');
          if (savedTab && ['profile', 'orders', 'licenses', 'downloads', 'support'].includes(savedTab)) {
            setActiveTab(savedTab);
            // Cập nhật URL để phản ánh tab
            router.push(`/account?tab=${savedTab}`, { scroll: false });
          }
        }
      } catch (error) {
        console.error('Không thể đọc tab từ localStorage:', error);
      }
    }
  }, [searchParams, router]);
  
  // Xử lý lỗi hình ảnh
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);
  
  // Format currency - memoized để tránh tính toán lại
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }, []);
  
  // Xử lý chuyển tab và cập nhật URL
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    // Lưu tab hiện tại vào localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accountActiveTab', tab);
      }
    } catch (error) {
      console.error('Không thể lưu tab vào localStorage:', error);
    }
    // Cập nhật URL với query params mới nhưng không tải lại trang
    router.push(`/account?tab=${tab}`, { scroll: false });
  }, [router]);
  
  // Sử dụng useIsomorphicLayoutEffect thay vì useLayoutEffect
  useIsomorphicLayoutEffect(() => {
    if (isClient && activeTab) {
      // Cập nhật URL mà không làm tải lại trang khi chuyển tab
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('tab', activeTab);
      window.history.pushState({}, '', newUrl.toString());
    }
  }, [activeTab, isClient]);
  
  // Hiển thị trạng thái loading khi đang kiểm tra session hoặc khi chưa ở client
  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Trang sẽ được chuyển hướng tự động bởi onUnauthenticated nếu chưa đăng nhập
  
  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <section className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Tài khoản của tôi</h1>
          <p className="text-xl max-w-3xl">
            Quản lý thông tin cá nhân, lịch sử mua hàng và giấy phép của bạn.
          </p>
        </div>
      </section>

      {/* Account Dashboard */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-4">
                    {!imageError ? (
                      <Image
                        src={session?.user?.image || '/images/logo.jpg'}
                        alt={session?.user?.name || 'User'}
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-teal-500 text-white rounded-full flex items-center justify-center text-3xl font-medium">
                        {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{session?.user?.name || 'Người dùng'}</h2>
                  <p className="text-gray-600">{session?.user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Thành viên từ {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                
                <nav className="space-y-1">
                  <button 
                    onClick={() => handleTabChange('profile')}
                    className={`flex w-full items-center px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hồ sơ cá nhân
                  </button>
                  <button 
                    onClick={() => handleTabChange('orders')}
                    className={`flex w-full items-center px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Lịch sử mua hàng
                  </button>
                  <button 
                    onClick={() => handleTabChange('licenses')}
                    className={`flex w-full items-center px-4 py-2 rounded-md ${activeTab === 'licenses' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Quản lý giấy phép
                  </button>
                  <button 
                    onClick={() => handleTabChange('downloads')}
                    className={`flex w-full items-center px-4 py-2 rounded-md ${activeTab === 'downloads' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải xuống
                  </button>
                  <button 
                    onClick={() => handleTabChange('support')}
                    className={`flex w-full items-center px-4 py-2 rounded-md ${activeTab === 'support' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Hỗ trợ kỹ thuật
                  </button>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Giấy phép đang hoạt động</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đơn hàng đã mua</span>
                    <span className="font-bold">{purchaseHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Yêu cầu hỗ trợ</span>
                    <span className="font-bold">0</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Profile Section */}
              {activeTab === 'profile' && (
                <ProfileTab session={session} />
              )}
              
              {/* Orders Section */}
              {activeTab === 'orders' && (
                <OrdersTab purchaseHistory={purchaseHistory} formatCurrency={formatCurrency} />
              )}
              
              {/* Licenses Section */}
              {activeTab === 'licenses' && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Quản lý giấy phép</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã giấy phép</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hết hạn</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tùy chọn</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {purchaseHistory.flatMap((order) => 
                          order.items.map((item) => (
                            <tr key={item.licenseKey}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">Phiên bản {item.version}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900 font-mono">{item.licenseKey}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{item.expiryDate}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Đang hoạt động
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-teal-600 hover:text-teal-900 mr-3">Gia hạn</button>
                                <button className="text-teal-600 hover:text-teal-900">Tải về</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Downloads Section */}
              {activeTab === 'downloads' && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Tải xuống sản phẩm</h2>
                  
                  <div className="space-y-4">
                    {purchaseHistory.flatMap((order) => 
                      order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">Phiên bản: {item.version}</p>
                            <p className="text-sm text-gray-500">Cập nhật gần nhất: {new Date().toLocaleDateString('vi-VN')}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
                              Tải xuống
                            </button>
                            <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                              Xem tài liệu
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Support Section */}
              {activeTab === 'support' && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Hỗ trợ kỹ thuật</h2>
                  
                  <div className="mb-8 border-b pb-6">
                    <h3 className="text-xl font-semibold mb-4">Tạo yêu cầu hỗ trợ mới</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                        <input
                          type="text"
                          id="subject"
                          className="px-4 py-2 border border-gray-300 rounded-md w-full"
                          placeholder="Nhập tiêu đề yêu cầu hỗ trợ"
                        />
                      </div>
                      <div>
                        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                        <select
                          id="product"
                          className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        >
                          <option value="">Chọn sản phẩm cần hỗ trợ</option>
                          {purchaseHistory.flatMap((order) => 
                            order.items.map((item) => (
                              <option key={item.id} value={item.id}>{item.name} - {item.version}</option>
                            ))
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                        <textarea
                          id="message"
                          rows={5}
                          className="px-4 py-2 border border-gray-300 rounded-md w-full"
                          placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải"
                        ></textarea>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                        >
                          Gửi yêu cầu
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Lịch sử yêu cầu hỗ trợ</h3>
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="text-gray-500">Bạn chưa có yêu cầu hỗ trợ nào.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 