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
    // Ví dụ: 
    // const fetchOrders = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await fetch('/api/admin/orders');
    //     const data = await response.json();
    //     setOrders(data.orders);
    //     setStats({
    //       total: data.stats.total,
    //       pending: data.stats.pending,
    //       processing: data.stats.processing,
    //       completed: data.stats.completed,
    //       cancelled: data.stats.cancelled, 
    //       refunded: data.stats.refunded,
    //       revenue: data.stats.revenue,
    //       averageOrderValue: data.stats.averageOrderValue
    //     });
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchOrders();

    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: '1',
        userName: 'Nguyễn Văn A',
        userEmail: 'nguyenvana@example.com',
        items: [
          {
            productId: 'prod-vt',
            productName: 'VoiceTyping',
            quantity: 1,
            price: 990000
          }
        ],
        totalAmount: 990000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        createdAt: '2023-05-20T15:30:00Z',
        updatedAt: '2023-05-20T15:30:00Z'
      },
      {
        id: 'ORD-002',
        userId: '2',
        userName: 'Trần Thị B',
        userEmail: 'tranthib@example.com',
        items: [
          {
            productId: 'prod-office',
            productName: 'Office Suite',
            quantity: 1,
            price: 1200000
          },
          {
            productId: 'prod-backup',
            productName: 'Backup Pro',
            quantity: 1,
            price: 500000
          }
        ],
        totalAmount: 1700000,
        status: 'processing',
        paymentMethod: 'momo',
        paymentStatus: 'paid',
        createdAt: '2023-05-28T21:20:00Z',
        updatedAt: '2023-05-28T21:20:00Z'
      },
      {
        id: 'ORD-003',
        userId: '3',
        userName: 'Lê Văn C',
        userEmail: 'levanc@example.com',
        items: [
          {
            productId: 'prod-secure',
            productName: 'Secure Vault',
            quantity: 1,
            price: 850000
          }
        ],
        totalAmount: 850000,
        status: 'pending',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        createdAt: '2023-05-29T16:45:00Z',
        updatedAt: '2023-05-29T16:45:00Z'
      },
      {
        id: 'ORD-004',
        userId: '4',
        userName: 'Phạm Thị D',
        userEmail: 'phamthid@example.com',
        items: [
          {
            productId: 'prod-design',
            productName: 'Design Master',
            quantity: 1,
            price: 1500000
          }
        ],
        totalAmount: 1500000,
        status: 'cancelled',
        paymentMethod: 'credit_card',
        paymentStatus: 'refunded',
        createdAt: '2023-05-15T23:30:00Z',
        updatedAt: '2023-05-15T23:30:00Z'
      },
      {
        id: 'ORD-005',
        userId: '5',
        userName: 'Hoàng Văn E',
        userEmail: 'hoangvane@example.com',
        items: [
          {
            productId: 'prod-vt',
            productName: 'VoiceTyping',
            quantity: 2,
            price: 990000
          }
        ],
        totalAmount: 1980000,
        status: 'completed',
        paymentMethod: 'zalopay',
        paymentStatus: 'paid',
        createdAt: '2023-05-25T18:10:00Z',
        updatedAt: '2023-05-25T18:10:00Z'
      }
    ];

    // Tính toán số liệu thống kê
    const totalOrders = 5;
    const pendingOrders = 1; // Chờ xử lý
    const processingOrders = 1; // Đang xử lý
    const completedOrders = 2; // Hoàn thành
    const cancelledOrders = 1; // Đã hủy
    const refundedOrders = 0; // Hoàn tiền
    
    // Tổng doanh thu: 990.000 + 1.980.000 = 2.970.000đ
    const revenue = 2970000;
    
    // Giá trị trung bình đơn hàng
    const averageOrderValue = revenue / completedOrders;

    setOrders(mockOrders);
    setStats({
      total: totalOrders,
      pending: pendingOrders,
      processing: processingOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      refunded: refundedOrders,
      revenue,
      averageOrderValue
    });
    
    setIsLoading(false);
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
        <Link
          href="/admin"
          className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
        >
          ← Quay lại Dashboard
        </Link>
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
                <p>Không tìm thấy đơn hàng phù hợp.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(OrdersPage); 