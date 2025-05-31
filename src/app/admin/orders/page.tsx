'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import withAdminAuth from '@/components/withAdminAuth';
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
    averageOrderValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  // Giả lập dữ liệu đơn hàng
  useEffect(() => {
    // CHÚ Ý: Đây là dữ liệu mẫu để hiển thị giao diện
    // Trong ứng dụng thực tế, cần thay thế bằng API call đến backend
    
    // QUAN TRỌNG: Đã tạo API endpoint tại /api/admin/orders
    // Bỏ comment dưới đây để sử dụng API thực tế khi đã có dữ liệu thật
    
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
          averageOrderValue: data.stats?.averageOrderValue || 0
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
          averageOrderValue: 0
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
    
  }, []);

  // Lọc đơn hàng theo tìm kiếm, trạng thái và thời gian
  const filteredOrders = orders.filter(order => {
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
      minute: '2-digit'
    }).format(date);
  };
  
  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Lấy tên trạng thái đơn hàng
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'refunded': return 'Hoàn tiền';
      default: return status;
    }
  };

  // Lấy màu của trạng thái đơn hàng
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex space-x-3">
          <Link
            href="/orders/history"
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 px-4 rounded-lg flex items-center text-sm transition-colors"
            target="_blank"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
            Xem trang khách hàng
          </Link>
          <Link
            href="/admin"
            className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Quay lại Dashboard
          </Link>
        </div>
      </div>
      
      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Tổng đơn hàng</h3>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Đơn hoàn thành</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Đơn đang xử lý</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.pending + stats.processing}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Doanh thu</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>
      
      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn/tên/email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
              <option value="refunded">Hoàn tiền</option>
            </select>
            
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="thisWeek">Tuần này</option>
              <option value="thisMonth">Tháng này</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Danh sách đơn hàng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tác vụ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                        <div className="text-sm text-gray-500">{order.userEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.productName} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusName(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Chi tiết
                        </button>
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            Hoàn thành
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button className="text-red-600 hover:text-red-900">
                            Hủy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                {orders.length === 0 ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Chưa có đơn hàng nào</p>
                    <p className="mb-4">Hiện tại chưa có đơn hàng nào được tạo trong hệ thống.</p>
                    <Link href="/admin" className="inline-flex items-center text-primary-600 hover:text-primary-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      Quay lại bảng điều khiển
                    </Link>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Không tìm thấy đơn hàng</p>
                    <p className="mb-4">Không tìm thấy đơn hàng nào phù hợp với bộ lọc đã chọn.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setTimeFilter('all');
                      }}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Xóa bộ lọc
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(OrdersPage); 