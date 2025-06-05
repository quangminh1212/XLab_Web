'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Khôi phục trạng thái sidebar từ localStorage
  useEffect(() => {
    // Chỉ thực hiện trên client-side
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('adminSidebarCollapsed');
      if (savedState !== null) {
        setIsSidebarCollapsed(savedState === 'true');
      }
    }
  }, []);

  // Lưu trạng thái sidebar vào localStorage khi thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSidebarCollapsed', isSidebarCollapsed.toString());
    }
  }, [isSidebarCollapsed]);

  const isActive = (path: string) => {
    // Đối với trang chính admin, chỉ active khi exact match
    if (path === '/admin') {
      return pathname === '/admin' ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' : '';
    }
    // Đối với các trang con, chỉ active khi pathname bắt đầu với path
    const active = pathname.startsWith(path + '/') || pathname === path;
    return active ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' : '';
  };

  // Log cho mục đích debug
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AdminLayout Debug:', {
        status,
        session: session ? 'session exists' : 'no session',
        userEmail: session?.user?.email,
        isAdmin: session?.user?.isAdmin,
      });
    }
  }, [session, status]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    // Sử dụng isAdmin thay vì kiểm tra email trực tiếp
    if (!session.user?.isAdmin) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Hiển thị loading khi đang kiểm tra session
  if (status === 'loading' || !session || !session.user?.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 text-white">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">XLab Admin</h1>
              <p className="text-sm mt-1 opacity-80">Xin chào, {session?.user?.name || 'Admin'}</p>
            </div>
            <div>
              <Link
                href="/"
                className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100 transition-colors duration-200"
              >
                Về trang chính
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto py-6 px-4 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16 md:w-16' : 'w-full md:w-64'} shrink-0`}
        >
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-6">
            <div
              className={`p-4 bg-teal-600 text-white font-medium flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}
            >
              {!isSidebarCollapsed && <span>Menu quản trị</span>}
              <button
                onClick={toggleSidebar}
                className="text-white focus:outline-none hover:bg-teal-700 rounded p-2 transition-colors"
                aria-label={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              >
                {isSidebarCollapsed ? (
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
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                ) : (
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
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                )}
              </button>
            </div>
            <nav className="p-2">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Dashboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin' ? 'text-white' : 'text-teal-600'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                    {!isSidebarCollapsed && <span className="ml-3">Dashboard</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/products"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin/products') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Quản lý sản phẩm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin/products' || pathname.startsWith('/admin/products/') ? 'text-white' : 'text-teal-600'}`}
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
                    {!isSidebarCollapsed && <span className="ml-3">Quản lý sản phẩm</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin/users') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Quản lý người dùng"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin/users' || pathname.startsWith('/admin/users/') ? 'text-white' : 'text-teal-600'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    {!isSidebarCollapsed && <span className="ml-3">Quản lý người dùng</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/orders"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin/orders') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Quản lý đơn hàng"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin/orders' || pathname.startsWith('/admin/orders/') ? 'text-white' : 'text-teal-600'}`}
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
                    {!isSidebarCollapsed && <span className="ml-3">Quản lý đơn hàng</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/notifications"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin/notifications') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Quản lý thông báo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin/notifications' || pathname.startsWith('/admin/notifications/') ? 'text-white' : 'text-teal-600'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {!isSidebarCollapsed && <span className="ml-3">Quản lý thông báo</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/coupons"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin/coupons') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Quản lý mã giảm giá"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin/coupons' || pathname.startsWith('/admin/coupons/') ? 'text-white' : 'text-teal-600'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {!isSidebarCollapsed && <span className="ml-3">Quản lý mã giảm giá</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-teal-50 transition-colors ${isActive('/admin/settings') || 'text-teal-600'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    title="Cài đặt hệ thống"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${pathname === '/admin/settings' || pathname.startsWith('/admin/settings/') ? 'text-white' : 'text-teal-600'}`}
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
                    {!isSidebarCollapsed && <span className="ml-3">Cài đặt hệ thống</span>}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
