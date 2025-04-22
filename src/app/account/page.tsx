'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// This would normally come from a database or API
const userProfile = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: '/images/avatar-placeholder.svg',
  memberSince: '01/01/2023',
  licenseCount: 3,
  phone: '',
}

const purchaseHistory = [
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
        originalPrice: 5990000,
        licenseKey: 'XLAB-BS-PRO-1234-5678-90AB',
        expiryDate: '15/03/2024',
        updates: true,
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
        originalPrice: 2490000,
        licenseKey: 'XLAB-SP-BAS-2345-6789-01CD',
        expiryDate: '20/04/2024',
        updates: true,
      },
      {
        id: 'design-master',
        name: 'XLab Design Master',
        version: 'Tiêu chuẩn',
        price: 1990000,
        originalPrice: 2490000,
        licenseKey: 'XLAB-DM-STD-3456-7890-12EF',
        expiryDate: '20/04/2024',
        updates: true,
      }
    ]
  }
]

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const [isSaving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Chuyển hướng người dùng nếu chưa đăng nhập
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account');
    }

    // Khởi tạo profile từ session nếu có
    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        avatar: session.user.image || prev.avatar
      }));
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

    // Giả lập API call
    setTimeout(() => {
      // Cập nhật thông tin
      // Trong thực tế, đây sẽ là một API call để lưu thông tin

      // Cập nhật thông tin trong session (giả lập)
      if (session && session.user) {
        // Trong thực tế, cần cập nhật session thông qua API
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            name: profile.name
          }
        };

        // Hiển thị thông tin debug để kiểm tra
        console.log('Thông tin ban đầu:', session.user);
        console.log('Thông tin đã cập nhật:', updatedSession.user);
      }

      setSaving(false);
      setSaveSuccess(true);

      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  // Format date (would normally use a proper date library)
  const formatDate = (dateString: string) => {
    return dateString // Already in DD/MM/YYYY format
  }

  // Tính tổng số tiền đã chi
  const totalSpent = purchaseHistory.reduce((sum, order) => sum + order.total, 0);

  // Tính tổng số tiền đã tiết kiệm
  const totalSaved = purchaseHistory.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => {
      return itemSum + (item.originalPrice - item.price);
    }, 0);
  }, 0);

  // Xử lý lỗi hình ảnh
  const handleImageError = () => {
    setImageError(true);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
                {purchaseHistory.reduce((sum, order) => sum + order.items.length, 0)}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Tất cả đang hoạt động</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng số tiền đã thanh toán</h3>
              <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalSpent)}</p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Qua {purchaseHistory.length} đơn hàng</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Tổng số tiền đã tiết kiệm</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(totalSaved)}</p>
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
                    <Image
                      src={imageError ? '/images/avatar-placeholder.svg' : (session?.user?.image || profile.avatar)}
                      alt={profile.name}
                      fill
                      className="rounded-full"
                      style={{ objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-gray-600 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Thành viên từ {profile.memberSince}</p>
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
                    <span className="font-bold">{profile.licenseCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đơn hàng đã mua</span>
                    <span className="font-bold">{purchaseHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng sản phẩm</span>
                    <span className="font-bold">{purchaseHistory.reduce((sum, order) => sum + order.items.length, 0)}</span>
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
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần Sản phẩm đã mua */}
              <div id="my-products" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm đã mua</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchaseHistory.flatMap(order => order.items).map((item, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.version}</p>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Giá</span>
                          <span className="font-semibold">{formatCurrency(item.price)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Tiết kiệm</span>
                          <span className="font-semibold text-green-600">{formatCurrency(item.originalPrice - item.price)}</span>
                        </div>
                        {/* Tìm order chứa item hiện tại */}
                        {purchaseHistory.map(order => {
                          if (order.items.some(orderItem => orderItem.id === item.id)) {
                            return (
                              <div key={`purchase-${order.id}-${item.id}`} className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Ngày mua</span>
                                <span className="font-semibold">{order.date}</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Hạn giấy phép</span>
                          <span className="font-semibold">{item.expiryDate}</span>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 transition">
                            Tải xuống
                          </button>
                          <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần Quản lý giấy phép */}
              <div id="licenses" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Quản lý giấy phép</h2>

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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Phần Lịch sử mua hàng */}
              <div id="orders" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h2>

                <div className="space-y-6">
                  {purchaseHistory.map((order, orderIndex) => (
                    <div key={orderIndex} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">Đơn hàng #{order.id}</h3>
                          <p className="text-sm text-gray-600">Ngày đặt: {order.date}</p>
                        </div>
                        <div>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="divide-y divide-gray-200">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="py-3 flex flex-col md:flex-row md:justify-between md:items-center">
                              <div className="mb-2 md:mb-0">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-600">{item.version}</div>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                                <div className="text-sm">
                                  <span className="text-gray-600">Giá: </span>
                                  <span className="font-semibold">{formatCurrency(item.price)}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-600">Hạn dùng: </span>
                                  <span className="font-semibold">{item.expiryDate}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 border-t pt-4 flex justify-between items-center">
                          <div className="text-lg font-semibold">
                            Tổng: {formatCurrency(order.total)}
                          </div>
                          <div className="flex space-x-3">
                            <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm">
                              Chi tiết hóa đơn
                            </button>
                            <button className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition text-sm">
                              Tải hóa đơn PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần Tải xuống */}
              <div id="downloads" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Tải xuống</h2>

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
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần Hỗ trợ kỹ thuật */}
              <div id="support" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Hỗ trợ kỹ thuật</h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-lg mb-2">Yêu cầu hỗ trợ mới</h3>
                    <p className="text-gray-600 mb-4">Gửi yêu cầu hỗ trợ kỹ thuật cho sản phẩm bạn đã mua</p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500">
                          <option value="">Chọn sản phẩm cần hỗ trợ</option>
                          {purchaseHistory.flatMap(order => order.items).map((item, index) => (
                            <option key={index} value={item.id}>{item.name} - {item.version}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="Nhập tiêu đề vấn đề" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả vấn đề</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 min-h-[120px]"
                          placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải"></textarea>
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">
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
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo qua email</span>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" defaultChecked />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo cập nhật sản phẩm</span>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" defaultChecked />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo khuyến mãi và ưu đãi</span>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" defaultChecked />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Thông báo hết hạn giấy phép</span>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4" defaultChecked />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">
                      Lưu thay đổi
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