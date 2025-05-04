'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// This would normally come from a database or API
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
        licenseKey: 'XLAB-SP-BAS-2345-6789-01CD',
        expiryDate: '20/04/2024',
        updates: true,
      },
      {
        id: 'design-master',
        name: 'XLab Design Master',
        version: 'Tiêu chuẩn',
        price: 1990000,
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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Xử lý chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Đồng bộ thông tin từ session khi đã đăng nhập
  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Xử lý lỗi hình ảnh
  useEffect(() => {
    const imgElement = document.getElementById('profile-image') as HTMLImageElement;
    if (imgElement) {
      imgElement.onerror = () => {
        setImageError(true);
      };
    }
    return () => {
      if (imgElement) {
        imgElement.onerror = null;
      }
    };
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }
  
  // Format date (would normally use a proper date library)
  const formatDate = (dateString: string) => {
    return dateString // Already in DD/MM/YYYY format
  }
  
  // Hiển thị trạng thái loading khi đang kiểm tra session
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

      {/* Account Dashboard */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-4">
                    {!imageError ? (
                      <Image
                        id="profile-image"
                        src={session?.user?.image || '/images/avatar-placeholder.svg'}
                        alt={session?.user?.name || 'User'}
                        width={96}
                        height={96}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-24 h-24 bg-teal-500 text-white rounded-full flex items-center justify-center text-3xl font-medium">
                        {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-gray-600 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">{session?.user?.name || 'Người dùng'}</h2>
                  <p className="text-gray-600">{session?.user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Thành viên từ {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                
                <nav className="space-y-1">
                  <a href="#profile" className="flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hồ sơ cá nhân
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
                  <a href="#my-products" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Sản phẩm của tôi
                  </a>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Giấy phép đang hoạt động</span>
                    <span className="font-bold">0</span>
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
              <div id="profile" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullname" className="block mb-2 font-semibold">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-semibold">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block mb-2 font-semibold">
                      Công ty
                    </label>
                    <input
                      type="text"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nhập tên công ty (nếu có)"
                      className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-bold text-lg mb-4">Đổi mật khẩu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="current-password" className="block mb-2 font-semibold">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block mb-2 font-semibold">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block mb-2 font-semibold">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button className="btn bg-primary-600 text-white">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
              
              {/* Licenses Section */}
              <div id="licenses" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Quản lý giấy phép</h2>
                
                <div className="space-y-6">
                  {purchaseHistory.flatMap((order) => 
                    order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                          <h3 className="font-bold text-lg">{item.name} - {item.version}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${item.updates ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.updates ? 'Đang cập nhật' : 'Hết hạn cập nhật'}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="block text-sm text-gray-600">Mã giấy phép</span>
                              <div className="flex items-center mt-1">
                                <span className="font-mono bg-gray-100 p-2 rounded text-sm flex-grow">{item.licenseKey}</span>
                                <button className="ml-2 text-gray-600 hover:text-gray-900">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div>
                              <span className="block text-sm text-gray-600">Cập nhật miễn phí đến</span>
                              <span className="font-semibold">{item.expiryDate}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3">
                            <button className="btn bg-primary-600 text-white">
                              Tải xuống
                            </button>
                            <button className="btn border border-gray-300 bg-white text-gray-700">
                              Kích hoạt trên thiết bị khác
                            </button>
                            {!item.updates && (
                              <button className="btn bg-yellow-500 text-white">
                                Gia hạn gói cập nhật
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-6">
                  <button className="btn border border-dashed border-gray-400 text-gray-700 w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm mã giấy phép mới
                  </button>
                </div>
              </div>
              
              {/* Purchase History */}
              <div id="orders" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã đơn hàng
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày mua
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tổng tiền
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {purchaseHistory.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{order.id}</div>
                            <div className="text-sm text-gray-500">{order.items.length} sản phẩm</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <a href="#" className="text-primary-600 hover:text-primary-900">Xem</a>
                              <a href="#" className="text-primary-600 hover:text-primary-900">Hóa đơn</a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Downloads Section */}
              <div id="downloads" className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Tải xuống phần mềm</h2>
                
                <div className="space-y-6">
                  {purchaseHistory.flatMap((order) => 
                    order.items.map((item, index) => (
                      <div key={`download-${order.id}-${index}`} className="border rounded-lg overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg">{item.name} - {item.version}</h3>
                            <p className="text-gray-600">Phiên bản mới nhất: v3.5.2 (Cập nhật: 10/02/2023)</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button className="btn bg-primary-600 text-white">
                              Windows 64-bit
                            </button>
                            <button className="btn bg-primary-600 text-white">
                              macOS
                            </button>
                            <button className="btn bg-primary-600 text-white">
                              Linux
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 border-t">
                          <details>
                            <summary className="cursor-pointer font-semibold">Phiên bản cũ hơn</summary>
                            <div className="mt-3 space-y-3 pl-4">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <p className="font-medium">v3.4.0 (01/01/2023)</p>
                                  <p className="text-sm text-gray-600">Cải thiện hiệu suất và sửa lỗi</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                                  <button className="btn-sm bg-gray-200 text-gray-700">
                                    Windows
                                  </button>
                                  <button className="btn-sm bg-gray-200 text-gray-700">
                                    macOS
                                  </button>
                                  <button className="btn-sm bg-gray-200 text-gray-700">
                                    Linux
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <p className="font-medium">v3.3.5 (15/12/2022)</p>
                                  <p className="text-sm text-gray-600">Thêm tính năng mới và sửa lỗi</p>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                                  <button className="btn-sm bg-gray-200 text-gray-700">
                                    Windows
                                  </button>
                                  <button className="btn-sm bg-gray-200 text-gray-700">
                                    macOS
                                  </button>
                                  <button className="btn-sm bg-gray-200 text-gray-700">
                                    Linux
                                  </button>
                                </div>
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Tài liệu hướng dẫn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href="#" 
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mr-4 text-primary-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold">Hướng dẫn sử dụng XLab Business Suite</h4>
                        <p className="text-sm text-gray-600">PDF, 5.2 MB</p>
                      </div>
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mr-4 text-primary-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold">Hướng dẫn sử dụng XLab Security Pro</h4>
                        <p className="text-sm text-gray-600">PDF, 3.7 MB</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Thêm section quản lý sản phẩm */}
              <div id="my-products" className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Sản phẩm của tôi</h2>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm sản phẩm mới
                  </button>
                </div>
                
                {/* Danh sách sản phẩm */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Phần mềm đã đăng (0)</h3>
                  
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h4 className="text-xl font-medium text-gray-700 mb-2">Chưa có sản phẩm nào</h4>
                    <p className="text-gray-500 mb-4">Bạn chưa đăng bán phần mềm nào. Hãy bắt đầu bằng cách thêm sản phẩm đầu tiên.</p>
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