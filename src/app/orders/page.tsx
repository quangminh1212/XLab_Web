'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useLangFetch } from '@/lib/langFetch';

// Khai báo kiểu dữ liệu
interface OrderItem {
  id: string;
  name: string;
  version: string;
  price: number;
  originalPrice: number;
  licenseKey: string;
  expiryDate: string;
  updates: boolean;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

// Dữ liệu mẫu để demo
const samplePurchaseHistory: Order[] = [
  {
    id: 'ORD-12345',
    date: '15/03/2023',
    total: 149000,
    status: 'Hoàn thành',
    items: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        version: 'Chuyên nghiệp',
        price: 149000,
        originalPrice: 500000,
        licenseKey: 'XLAB-CGP-PRO-1234-5678-90AB',
        expiryDate: '15/03/2024',
        updates: true,
      },
    ],
  },
  {
    id: 'ORD-12346',
    date: '20/04/2023',
    total: 298000,
    status: 'Hoàn thành',
    items: [
      {
        id: 'grok',
        name: 'Grok',
        version: 'Cơ bản',
        price: 149000,
        originalPrice: 750000,
        licenseKey: 'XLAB-GRK-BAS-5678-9012-CDEF',
        expiryDate: '20/05/2024',
        updates: true,
      },
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        version: 'Premium',
        price: 149000,
        originalPrice: 500000,
        licenseKey: 'XLAB-CGP-PRE-9012-3456-GHIJ',
        expiryDate: '20/05/2024',
        updates: false,
      },
    ],
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [purchaseHistory, setPurchaseHistory] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const lfetch = useLangFetch();

  useEffect(() => {
    // Tải danh sách sản phẩm
    const fetchProducts = async () => {
      try {
        const data = await lfetch('/api/products', { retries: 2 });
        setProducts(data.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
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
    // Chuyển hướng người dùng nếu chưa đăng nhập
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
      return;
    }

    if (status === 'loading') {
      return;
    }

    // Nếu người dùng đã xác thực
    if (status === 'authenticated' && session?.user) {
      // Mô phỏng việc tải dữ liệu từ API
      setTimeout(() => {
        // Kiểm tra dữ liệu từ localStorage
        if (session.user.email) {
          const savedPurchases = localStorage.getItem(`purchases_${session.user.email}`);

          if (savedPurchases) {
            try {
              const parsedPurchases = JSON.parse(savedPurchases);
              setPurchaseHistory(parsedPurchases);
            } catch (e) {
              console.error('Lỗi khi parse dữ liệu mua hàng:', e);
              setPurchaseHistory([]);
            }
          } else {
            // Hiển thị dữ liệu mẫu nếu không có dữ liệu thực
            const showDemo = localStorage.getItem('show_demo_data') === 'true';
            if (showDemo) {
              setPurchaseHistory(samplePurchaseHistory);
            } else {
              setPurchaseHistory([]);
            }
          }
        }
        setIsLoading(false);
      }, 1000);
    }
  }, [status, session, router]);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  // Hàm định dạng ngày
  const formatDate = (dateString: string) => {
    // Giả sử định dạng đầu vào là DD/MM/YYYY
    return dateString;
  };

  // Hàm xử lý khi bấm vào đơn hàng
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <div className="mx-auto py-10 px-0 sm:px-6 lg:px-8 max-w-full md:max-w-[98%] xl:max-w-[1280px] 2xl:max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-balance break-words">Đơn hàng của tôi</h1>
        <p className="mt-2 text-gray-600 text-balance leading-relaxed">Xem và quản lý tất cả đơn hàng của bạn tại XLab.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : purchaseHistory.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {purchaseHistory.map((order) => (
              <div key={order.id} className="p-4 sm:p-6">
                <div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Đơn hàng #{order.id}</h3>
                    <p className="text-sm text-gray-500">Ngày đặt: {formatDate(order.date)}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Hoàn thành'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Đang xử lý'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.total)}</span>
                    <svg
                      className={`h-5 w-5 text-gray-400 transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Chi tiết đơn hàng</h4>
                    <div className="bg-gray-50 rounded-lg overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Sản phẩm
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Ảnh
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Phiên bản
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              License key
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Giá
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                  Hết hạn: {item.expiryDate}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                  <Image
                                    src={getProductImage(item.id, item.name)}
                                    alt={item.name}
                                    fill
                                    className="object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/images/placeholder/product-placeholder.jpg';
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{item.version}</span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900 font-mono">
                                  {item.licenseKey}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(item.price)}
                                {item.originalPrice > item.price && (
                                  <span className="line-through text-gray-500 ml-2">
                                    {formatCurrency(item.originalPrice)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Xem chi tiết đầy đủ
                      </Link>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Tổng tiền:</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-900">Chưa có đơn hàng nào</h3>
          <p className="mt-1 text-gray-500">Bạn chưa có đơn hàng nào. Hãy mua sắm để bắt đầu!</p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/account"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <svg
            className="mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Quay lại trang tài khoản
        </Link>
      </div>
    </div>
  );
}
