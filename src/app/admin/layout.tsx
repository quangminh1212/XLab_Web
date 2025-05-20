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
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isActive = (path: string) => {
        return pathname === path ? 'bg-primary-800' : '';
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
        // Đang tải thông tin session
        if (status === 'loading') {
            setIsLoading(true);
            return;
        }
        
        // Chưa đăng nhập
        if (!session) {
            setIsLoading(false);
            console.log('User not logged in, redirecting to login');
            router.push('/login');
            return;
        }
        
        // Kiểm tra quyền admin
        const isXLabEmail = session.user?.email === 'xlab.rnd@gmail.com';
        const hasAdminFlag = session.user?.isAdmin === true;
        
        if (!hasAdminFlag && !isXLabEmail) {
            setIsLoading(false);
            console.log('User is not an admin, redirecting to home');
            router.push('/');
            return;
        }
        
        // Người dùng có quyền admin
        setIsAuthorized(true);
        setIsLoading(false);
    }, [session, status, router]);
    
    // Hiển thị loading khi đang kiểm tra session
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                <div className="ml-3 text-primary-600">Đang tải...</div>
            </div>
        );
    }
    
    // Không hiển thị gì nếu người dùng không có quyền admin (để tránh flash trước khi chuyển hướng)
    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-primary-700 text-white">
                <div className="container mx-auto py-6 px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">XLab Admin</h1>
                            <p className="text-sm mt-1 opacity-80">Xin chào, {session?.user?.name || 'Admin'}</p>
                        </div>
                        <div>
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white text-primary-700 rounded hover:bg-gray-100 transition-colors duration-200"
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
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-4 bg-primary-600 text-white font-medium">Menu quản trị</div>
                        <nav className="p-2">
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href="/admin"
                                        className={`block px-4 py-2 rounded text-gray-800 hover:bg-primary-50 transition-colors ${isActive('/admin')}`}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/products"
                                        className={`block px-4 py-2 rounded text-gray-800 hover:bg-primary-50 transition-colors ${isActive('/admin/products')}`}
                                    >
                                        Quản lý sản phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/users"
                                        className={`block px-4 py-2 rounded text-gray-800 hover:bg-primary-50 transition-colors ${isActive('/admin/users')}`}
                                    >
                                        Quản lý người dùng
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/orders"
                                        className={`block px-4 py-2 rounded text-gray-800 hover:bg-primary-50 transition-colors ${isActive('/admin/orders')}`}
                                    >
                                        Quản lý đơn hàng
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/settings"
                                        className={`block px-4 py-2 rounded text-gray-800 hover:bg-primary-50 transition-colors ${isActive('/admin/settings')}`}
                                    >
                                        Cài đặt hệ thống
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