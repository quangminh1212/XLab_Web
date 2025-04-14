'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react';

export const metadata = {
  title: 'Tài khoản | XLab - Phần mềm và Dịch vụ',
  description: 'Quản lý tài khoản, giấy phép và lịch sử mua hàng của bạn tại XLab',
}

// This would normally come from a database or API
const userProfile = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: '/images/avatar-placeholder.svg',
  memberSince: '01/01/2023',
  licenseCount: 3,
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
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Khi session thay đổi, cập nhật trạng thái loading
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  // Xử lý đăng xuất
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Nếu không có session, chuyển hướng về trang đăng nhập
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bạn chưa đăng nhập</h1>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
          <Link
            href="/login"
            className="inline-block py-2.5 px-6 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Hiển thị thông tin người dùng khi đã đăng nhập
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold">Thông tin tài khoản</h1>
            <p className="mt-2 opacity-90">Xin chào, đây là thông tin tài khoản của bạn</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex-shrink-0">
                {session.user?.image ? (
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Avatar'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                    {session.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{session.user?.name || 'Người dùng'}</h2>
                <p className="text-gray-500 mb-4">{session.user?.email || 'Email không có sẵn'}</p>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Thông tin chi tiết từ Google:</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><span className="font-medium">ID:</span> {session.user?.id || 'Không có sẵn'}</p>
                      <p><span className="font-medium">Provider:</span> Google</p>
                      <p><span className="font-medium">Email đã xác minh:</span> {session.user?.email ? 'Có' : 'Không'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      onClick={handleSignOut}
                      className="py-2.5 px-6 bg-red-600 text-white rounded-full hover:bg-red-700 transition flex-1"
                    >
                      Đăng xuất
                    </button>
                    <Link
                      href="/"
                      className="py-2.5 px-6 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition flex-1 text-center"
                    >
                      Về trang chủ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Thông tin này được lấy từ tài khoản Google của bạn thông qua OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  );
} 