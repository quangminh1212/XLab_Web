'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        recentOrders: [] as any[],
    });

    useEffect(() => {
        // Hàm lấy thống kê
        const fetchStats = async () => {
            try {
                // Trong môi trường thực tế, đây sẽ là API call
                // Ví dụ: const response = await fetch('/api/admin/stats');
                
                // Mock data cho UI
                setStats({
                    totalProducts: 12,
                    totalUsers: 45,
                    totalOrders: 27,
                    recentOrders: [
                        { id: 'ORD-001', customer: 'Nguyễn Văn A', date: '2023-11-15', total: 1200000, status: 'completed' },
                        { id: 'ORD-002', customer: 'Trần Thị B', date: '2023-11-14', total: 950000, status: 'processing' },
                        { id: 'ORD-003', customer: 'Lê Văn C', date: '2023-11-13', total: 2500000, status: 'completed' },
                        { id: 'ORD-004', customer: 'Phạm Thị D', date: '2023-11-12', total: 750000, status: 'cancelled' },
                    ],
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get status text
    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Hoàn thành';
            case 'processing':
                return 'Đang xử lý';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="text-sm text-gray-600">
                    Xin chào, {session?.user?.name || 'Admin'}!
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Sản phẩm</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalProducts}</div>
                    <div className="mt-2">
                        <Link 
                            href="/admin/products" 
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Người dùng</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
                    <div className="mt-2">
                        <Link 
                            href="/admin/users" 
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm font-medium text-gray-500 mb-1">Đơn hàng</div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalOrders}</div>
                    <div className="mt-2">
                        <Link 
                            href="/admin/orders" 
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                        >
                            Xem tất cả →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-medium text-gray-800">Đơn hàng gần đây</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã đơn hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày đặt
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.date).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(order.total)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link 
                                            href={`/admin/orders/${order.id}`} 
                                            className="text-primary-600 hover:text-primary-900"
                                        >
                                            Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 