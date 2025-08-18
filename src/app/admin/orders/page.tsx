'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import withAdminAuth from '@/components/withAdminAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order, OrderStats } from '@/models/OrderModel';

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0,
    revenue: 0,
    averageOrderValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const { language, localCode } = useLanguage();

  // Fetch real order data from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/orders');
        const data = await response.json();
        setOrders(data.orders || []);
        setStats({
          total: data.stats?.total || 0,
          pending: data.stats?.pending || 0,
          processing: data.stats?.processing || 0,
          completed: data.stats?.completed || 0,
          cancelled: data.stats?.cancelled || 0,
          refunded: data.stats?.refunded || 0,
          revenue: data.stats?.revenue || 0,
          averageOrderValue: data.stats?.averageOrderValue || 0,
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Set empty data when error occurs
        setOrders([]);
        setStats({
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          cancelled: 0,
          refunded: 0,
          revenue: 0,
          averageOrderValue: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Lọc đơn hàng theo tìm kiếm, trạng thái và thời gian
  const filteredOrders = orders.filter((order) => {
    // Lọc theo từ khóa tìm kiếm
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = order.status === statusFilter;
    }

    // Lọc theo thời gian
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();

      switch (timeFilter) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          matchesTime = orderDate >= today;
          break;
        case 'thisWeek':
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          matchesTime = orderDate >= startOfWeek;
          break;
        case 'thisMonth':
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          matchesTime = orderDate >= startOfMonth;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  // Format thời gian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Lấy tên trạng thái đơn hàng
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending':
        return localCode === 'vi' ? 'Chờ xử lý' : 'Pending';
      case 'processing':
        return localCode === 'vi' ? 'Đang xử lý' : 'Processing';
      case 'completed':
        return localCode === 'vi' ? 'Hoàn thành' : 'Completed';
      case 'cancelled':
        return localCode === 'vi' ? 'Đã hủy' : 'Cancelled';
      case 'refunded':
        return localCode === 'vi' ? 'Hoàn tiền' : 'Refunded';
      default:
        return status;
    }
  };

  // Lấy màu của trạng thái đơn hàng
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-balance break-words">
          {localCode === 'vi' ? 'Quản lý đơn hàng' : 'Order Management'}
        </h1>
        <div className="flex space-x-3">
          <Link
            href="/orders/history"
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                clipRule="evenodd"
              />
            </svg>
            {localCode === 'vi' ? 'Xem trang khách hàng' : 'View customer page'}
          </Link>
          <Link
            href="/admin"
            className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            {localCode === 'vi' ? 'Quay lại Dashboard' : 'Back to Dashboard'}
          </Link>
        </div>
      </div>

      {/* Thống kê đơn hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            {localCode === 'vi' ? 'Tổng đơn hàng' : 'Total Orders'}
          </h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            {localCode === 'vi' ? 'Đơn chờ xử lý' : 'Pending Orders'}
          </h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            {localCode === 'vi' ? 'Hoàn thành' : 'Completed'}
          </h3>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-1">
            {localCode === 'vi' ? 'Doanh thu' : 'Revenue'}
          </h3>
          <p className="text-3xl font-bold text-blue-700">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={localCode === 'vi' ? "Tìm kiếm theo ID, tên, email..." : "Search by ID, name, email..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{localCode === 'vi' ? 'Tất cả trạng thái' : 'All statuses'}</option>
              <option value="pending">{localCode === 'vi' ? 'Chờ xử lý' : 'Pending'}</option>
              <option value="processing">{localCode === 'vi' ? 'Đang xử lý' : 'Processing'}</option>
              <option value="completed">{localCode === 'vi' ? 'Hoàn thành' : 'Completed'}</option>
              <option value="cancelled">{localCode === 'vi' ? 'Đã hủy' : 'Cancelled'}</option>
              <option value="refunded">{localCode === 'vi' ? 'Hoàn tiền' : 'Refunded'}</option>
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">{localCode === 'vi' ? 'Tất cả thời gian' : 'All time'}</option>
              <option value="today">{localCode === 'vi' ? 'Hôm nay' : 'Today'}</option>
              <option value="thisWeek">{localCode === 'vi' ? 'Tuần này' : 'This week'}</option>
              <option value="thisMonth">{localCode === 'vi' ? 'Tháng này' : 'This month'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Mã đơn hàng' : 'Order ID'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Khách hàng' : 'Customer'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Ngày đặt' : 'Date'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Tổng tiền' : 'Total'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Phương thức' : 'Payment Method'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Trạng thái' : 'Status'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {localCode === 'vi' ? 'Hành động' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-xs text-gray-500">
                          {localCode === 'vi' ? 'Sản phẩm: ' : 'Products: '}{order.items.length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.paymentMethod === 'credit_card' 
                          ? (localCode === 'vi' ? 'Thẻ' : 'Card')
                          : order.paymentMethod === 'bank_transfer'
                            ? (localCode === 'vi' ? 'Chuyển khoản' : 'Bank Transfer')
                            : order.paymentMethod === 'momo' || order.paymentMethod === 'zalopay'
                              ? order.paymentMethod.toUpperCase()
                              : order.paymentMethod === 'cash'
                                ? (localCode === 'vi' ? 'Tiền mặt' : 'Cash')
                                : order.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusName(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                          {localCode === 'vi' ? 'Xem' : 'View'}
                        </Link>
                        {order.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-900 ml-2">
                            {localCode === 'vi' ? 'Duyệt' : 'Approve'}
                          </button>
                        )}
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button className="text-red-600 hover:text-red-900 ml-2">
                            {localCode === 'vi' ? 'Hủy' : 'Cancel'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      {localCode === 'vi' ? 'Không tìm thấy đơn hàng nào' : 'No orders found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(OrdersPage);
