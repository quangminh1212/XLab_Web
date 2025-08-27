'use client';

import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useLangFetch } from '@/lib/langFetch';

import { useLanguage } from '@/contexts/LanguageContext';

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
  const { data: _session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const lfetch = useLangFetch();
  const { t, localCode } = useLanguage();

  useEffect(() => {
    // Tải danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const data = await lfetch('/api/products', { retries: 2 });
        setProducts(data.data || []);
      } catch (_error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', _error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm lấy ảnh sản phẩm từ danh sách sản phẩm
  const getProductImage = (productId: string, _productName: string) => {
    const product = products.find((p) => p.id === productId || p.slug === productId);

    if (product && product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // Trả về ảnh đầu tiên trong mảng images
      return firstImage;
    }

    return '/images/placeholder/product-placeholder.svg';
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
        } catch (_error) {
          console.error('Lỗi khi lấy dữ liệu đơn hàng:', _error);

          // Dữ liệu mẫu để hiển thị khi có lỗi
          const sampleOrders: Order[] = [
            {
              id: 'XL-361231',
              status: 'completed',
              totalAmount: 149000,
              createdAt: '2023-04-06T11:16:00Z',
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
              id: 'XL-806787',
              status: 'completed',
              totalAmount: 298000,
              createdAt: '2023-08-06T11:16:00Z',
              items: [
                {
                  productId: 'grok',
                  productName: 'Grok',
                  quantity: 2,
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
        return t('orders.pending');
      case 'processing':
        return t('orders.processing');
      case 'completed':
        return t('orders.completed');
      case 'cancelled':
        return t('orders.cancelled');
      case 'refunded':
        return t('orders.refunded');
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
    return date.toLocaleString(localCode === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(localCode === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="mx-auto py-8 px-4 max-w-[98%] md:max-w-3xl xl:max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mx-auto py-8 px-4 max-w-[98%] md:max-w-3xl xl:max-w-4xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{t('orders.needLogin')}</h2>
          <p className="text-gray-600 mb-6">{t('orders.needLoginDesc')}</p>
          <Link
            href="/login"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('orders.login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 px-4 max-w-[98%] md:max-w-3xl xl:max-w-4xl">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">{t('orders.history')}</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-3"
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
          <h2 className="text-base font-medium text-gray-700 mb-2">{t('orders.noOrders')}</h2>
          <p className="text-gray-500 mb-4 text-sm">
            {t('orders.noOrdersDesc')}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-primary-600 text-white px-4 py-2 text-sm rounded-md hover:bg-primary-700 transition-colors"
          >
            {t('orders.exploreProducts')}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1.5"
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
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 mr-1 font-medium">{t('orders.orderCode')}:</span>
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 mr-1 font-medium">{t('orders.orderDate')}:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusName(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                          <Image
                            src={getProductImage(item.productId, item.productName)}
                            alt={item.productName}
                            fill
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder/product-placeholder.svg';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 text-sm">{item.productName}</h3>
                          <p className="text-xs text-gray-500">
                            <span className="inline-block mr-1">{t('orders.quantity')}:</span>
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800 text-sm">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 text-sm">{t('orders.total')}:</span>
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium text-xs"
                  >
                    {t('orders.viewDetails')}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
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
