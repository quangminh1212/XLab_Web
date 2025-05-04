'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  
  // Xác nhận rằng code đang chạy ở phía client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Xử lý chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Hiển thị trạng thái loading khi đang kiểm tra session hoặc khi chưa ở client
  if (!isClient || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Hiển thị trang đăng nhập nếu chưa đăng nhập
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6 text-center">Bạn cần đăng nhập để truy cập trang tài khoản</p>
          <div className="flex justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors w-full text-center"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tài khoản của tôi</h1>
          <p className="text-lg text-gray-600">
            Xin chào, {session?.user?.name}! Đây là trang tài khoản của bạn.
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
            <p className="mb-2"><span className="font-medium">Tên:</span> {session?.user?.name}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {session?.user?.email}</p>
          </div>
          
          <div className="text-center mt-6">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 