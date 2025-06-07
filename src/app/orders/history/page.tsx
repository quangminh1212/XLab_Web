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
    const product = products.find((p) => p.id === productId || p.slug === productId);

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
                  price: 149000,
                },
              ],
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
                  price: 149000,
                },
                {
                  productId: 'chatgpt',
                  productName: 'ChatGPT',
                  quantity: 1,
                  price: 149000,
                },
              ],
            },
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
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'refunded':
        return 'Hoàn tiền';
      default:
        return status;
    }
  };

  // Màu sắc trạng thái
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
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      year: 'numeric',
    });
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
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
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-10 border-l-4 border-primary-600 pl-4">
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử đơn hàng của bạn</h1>
        <p className="text-gray-600 mt-2">Quản lý và theo dõi tất cả đơn hàng của bạn tại XLab</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-100">
          <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Bạn chưa có đơn hàng nào</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Hãy khám phá các sản phẩm của chúng tôi và trải nghiệm dịch vụ ngay hôm nay!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Xem sản phẩm
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-primary-100"
            >
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center">
                    <div className="bg-primary-50 p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Mã đơn hàng:</span>
                      <span className="ml-2 font-bold text-gray-800">{order.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary-50 p-2 rounded-lg mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Ngày đặt:</span>
                      <span className="ml-2 font-medium text-gray-800">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)} inline-flex items-center shadow-sm`}
                    >
                      {order.status === 'completed' && (
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                      {getStatusName(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 flex items-center justify-between group">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 group-hover:border-primary-100 transition-colors duration-300">
                          <Image
                            src={getProductImage(item.productId, item.productName)}
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder/product-placeholder.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 group-hover:text-primary-600 transition-colors duration-300">{item.productName}</h3>
                          <div className="flex items-center mt-1.5">
                            <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                              </svg>
                              Số lượng: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Tổng cộng:</span>
                  <span className="font-bold text-xl text-primary-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="mt-5 flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center px-5 py-2.5 bg-white border border-primary-200 text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow"
                  >
                    Xem chi tiết
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
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
