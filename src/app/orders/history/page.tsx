'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
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
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Tải danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
      }
    };
    
    fetchProducts();
  }, []);

  // Hàm lấy ảnh sản phẩm từ danh sách sản phẩm
  const getProductImage = (productId: string, productName: string) => {
    const product = products.find(p => 
      p.id === productId || 
      p.slug === productId
    );
    
    if (product && product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // Trả về ảnh đầu tiên trong mảng images
      return firstImage;
    }
    
    return '/images/placeholder/product-placeholder.jpg';
  };

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
          const sampleOrders: Order[] = [
            {
              id: 'ORD-12345',
              status: 'completed',
              totalAmount: 149000,
              createdAt: '2023-03-15T15:30:00Z',
              items: [
                {
                  productId: 'chatgpt',
                  productName: 'ChatGPT',
                  quantity: 1,
                  price: 149000
                }
              ]
            },
            {
              id: 'ORD-12346',
              status: 'completed',
              totalAmount: 298000,
              createdAt: '2023-04-20T21:20:00Z',
              items: [
                {
                  productId: 'grok',
                  productName: 'Grok',
                  quantity: 1,
                  price: 149000
                },
                {
                  productId: 'chatgpt',
                  productName: 'ChatGPT',
                  quantity: 1,
                  price: 149000
                }
              ]
            }
          ];
          setOrders(sampleOrders);
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
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lịch sử mua hàng</h1>
        <Link 
          href="/orders/history" 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Xem tất cả đơn hàng
        </Link>
      </div>

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
        <div className="space-y-1">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded border shadow-sm hover:shadow-md transition-shadow">
              <div className="px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  {/* Thông tin đơn hàng - bên trái */}
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="font-medium text-gray-900 min-w-[120px]">{order.id}</span>
                    <span className="text-gray-500">{formatDate(order.createdAt)}</span>
                    <span className="text-gray-700 flex-1">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.productName}
                          {index < order.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </span>
                  </div>
                  
                  {/* Trạng thái và tổng tiền - bên phải */}
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusName(order.status)}
                    </span>
                    <span className="font-bold text-primary-600 min-w-[100px] text-right">{formatCurrency(order.totalAmount)}</span>
                    <Link 
                      href={`/orders/${order.id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium text-xs"
                    >
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 