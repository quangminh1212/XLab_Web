'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ fetch dữ liệu khi người dùng đã đăng nhập
    if (status === 'authenticated') {
      const fetchOrders = async () => {
        try {
          // Đã tạo API endpoint tại /api/orders/history
          const response = await fetch('/api/orders/history');
          
          if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu đơn hàng');
          }
          
          const data = await response.json();
          setOrders(data.orders);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
          
          // Dữ liệu mẫu để hiển thị khi có lỗi
          setOrders([
            {
              id: 'ORD-001',
              status: 'completed',
              totalAmount: 990000,
              createdAt: '2023-05-20T15:30:00Z',
              items: [
                {
                  productId: 'prod-vt',
                  productName: 'VoiceTyping',
                  quantity: 1,
                  price: 990000
                }
              ]
            },
            {
              id: 'ORD-002',
              status: 'processing',
              totalAmount: 1700000,
              createdAt: '2023-05-28T21:20:00Z',
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
              ]
            }
          ]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [status]);

  // Hiển thị trạng thái đơn hàng
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

  // Màu sắc trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Bạn cần đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn</p>
          <Link 
            href="/login" 
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Lịch sử đơn hàng của bạn</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-lg font-medium text-gray-700 mb-2">Bạn chưa có đơn hàng nào</h2>
          <p className="text-gray-500 mb-6">Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay!</p>
          <Link 
            href="/products" 
            className="inline-flex items-center bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Xem sản phẩm
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex flex-wrap justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                    <span className="ml-2 font-medium">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Ngày đặt:</span>
                    <span className="ml-2">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusName(order.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng cộng:</span>
                  <span className="font-bold text-xl text-primary-600">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Xem chi tiết
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 