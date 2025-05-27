'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
        const active = pathname === path || pathname.startsWith(path + '/');
        return active ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : '';
    };
    
    // Log cho mục đích debug
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('AdminLayout Debug:', { 
                status, 
                session: session ? 'session exists' : 'no session',
                userEmail: session?.user?.email,
                isAdmin: session?.user?.isAdmin
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A19A]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="container mx-auto py-6 px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">XLab Admin</h1>
                            <p className="text-sm mt-1 opacity-80">Xin chào, {session?.user?.name || 'Admin'}</p>
                        </div>
                        <div>
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors duration-200"
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
                <div className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16 md:w-16' : 'w-full md:w-64'} shrink-0`}>
                    <div className="bg-white rounded-lg shadow overflow-hidden sticky top-6">
                        <div className={`p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium flex ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                            {!isSidebarCollapsed && <span>Menu quản trị</span>}
                            <button 
                                onClick={toggleSidebar} 
                                className="text-white focus:outline-none hover:bg-blue-700 rounded p-2 transition-colors"
                                aria-label={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                                title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                            >
                                {isSidebarCollapsed ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <nav className="p-2">
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/admin"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Dashboard"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/admin' ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Dashboard</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/products"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin/products')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Quản lý sản phẩm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/admin/products' ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Quản lý sản phẩm</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/users"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin/users')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Quản lý người dùng"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/admin/users' ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Quản lý người dùng</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/orders"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin/orders')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Quản lý đơn hàng"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/admin/orders' ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Quản lý đơn hàng</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/notifications"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin/notifications')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Quản lý thông báo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname.includes('/notifications') ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5M4 19h6v-7a3 3 0 00-3-3H4a3 3 0 00-3 3v7M4 9V6a3 3 0 013-3h3l3 3v3M4 9h6m6 0a3 3 0 013 3v7l-3-3h-3a3 3 0 01-3-3V9z" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Quản lý thông báo</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/coupons"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin/coupons')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Quản lý mã giảm giá"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname.includes('/admin/coupons') ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Quản lý mã giảm giá</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/settings"
                                        className={`flex items-center px-4 py-3 rounded text-gray-800 hover:bg-blue-50 transition-colors ${isActive('/admin/settings')} ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                        title="Cài đặt hệ thống"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${pathname === '/admin/settings' ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {!isSidebarCollapsed && (
                                            <span>Cài đặt hệ thống</span>
                                        )}
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
} 