'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isActive = (path: string) => {
        return pathname === path ? 'bg-primary-800' : '';
    };

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
                                <li className="px-4 py-2 text-gray-400">Quản lý người dùng</li>
                                <li className="px-4 py-2 text-gray-400">Quản lý đơn hàng</li>
                                <li className="px-4 py-2 text-gray-400">Cài đặt hệ thống</li>
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