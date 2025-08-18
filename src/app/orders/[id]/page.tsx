'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import React from 'react';

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
  image?: string; // Thêm trường ảnh sản phẩm
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

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  // Use React.use to properly unwrap the params object
  const { id: orderId } = React.use(params);

  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]); // Thêm state cho danh sách sản phẩm

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
    console.log('Tìm ảnh cho sản phẩm:', { productId, productName });
    console.log('Danh sách sản phẩm hiện có:', products);

    const product = products.find((p) => p.id === productId || p.slug === productId);

    console.log('Sản phẩm tìm thấy:', product);

    if (product && product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      console.log('Ảnh đầu tiên:', firstImage);
      // Trả về ảnh đầu tiên trong mảng images
      return firstImage;
    }

    console.log('Sử dụng ảnh placeholder');
    return '/images/placeholder/product-placeholder.jpg';
  };

  useEffect(() => {
    // Tạm thời bỏ qua authentication để test
    // if (status === 'unauthenticated') {
    //   router.push('/login?callbackUrl=/orders/' + orderId);
    //   return;
    // }

    // if (status === 'loading') {
    //   return;
    // }

    // Nếu người dùng đã xác thực (hoặc để test)
    // if (status === 'authenticated' && session?.user) {
    // Mô phỏng việc tải dữ liệu từ API
    setTimeout(() => {
      // Luôn hiển thị demo data để test
      const foundOrder = samplePurchaseHistory.find((o) => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setIsLoading(false);
    }, 1000);
    // }
  }, [orderId]);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  // Hàm giả lập tải xuống hóa đơn
  const handleDownloadInvoice = () => {
    alert('Tính năng tải xuống hóa đơn đang được phát triển.');
  };

  // Hàm xử lý khi gửi yêu cầu hỗ trợ
  const handleSupportRequest = () => {
    router.push(`/support?order=${orderId}`);
  };

  return (
    <div className="mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-[98%] xl:max-w-[1280px] 2xl:max-w-[1400px]">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-balance break-words">Chi tiết đơn hàng</h1>
          <p className="mt-2 text-gray-600 text-balance leading-relaxed">
            {order ? `Đơn hàng #${order.id} - ${order.date}` : 'Đang tải...'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/orders"
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
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : order ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Thông tin đơn hàng */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h2 className="text-xs font-medium text-gray-500 uppercase">Mã đơn hàng</h2>
                <p className="mt-1 text-sm font-medium text-gray-900">{order.id}</p>
              </div>
              <div>
                <h2 className="text-xs font-medium text-gray-500 uppercase">Ngày đặt hàng</h2>
                <p className="mt-1 text-sm font-medium text-gray-900">{order.date}</p>
              </div>
              <div>
                <h2 className="text-xs font-medium text-gray-500 uppercase">Trạng thái</h2>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Hoàn thành'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Đang xử lý'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Chi tiết sản phẩm */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết sản phẩm</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sản phẩm
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ảnh
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phiên bản
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      License key
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ngày hết hạn
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Giá
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.version}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {item.licenseKey}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.expiryDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
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
          </div>

          {/* Tổng tiền */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-full sm:w-64">
                <div className="flex justify-between py-1 text-sm">
                  <dt className="text-gray-500">Tạm tính</dt>
                  <dd className="text-gray-900 font-medium">{formatCurrency(order.total)}</dd>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <dt className="text-gray-500">Giảm giá</dt>
                  <dd className="text-gray-900 font-medium">0 ₫</dd>
                </div>
                <div className="flex justify-between py-1 text-base font-medium border-t border-gray-200 mt-2 pt-2">
                  <dt className="text-gray-900">Tổng tiền</dt>
                  <dd className="text-primary-600">{formatCurrency(order.total)}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Thanh công cụ */}
          <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Tải hóa đơn
              </button>
              <button
                onClick={handleSupportRequest}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Yêu cầu hỗ trợ
              </button>
            </div>
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-xl font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
          <p className="mt-1 text-gray-500">
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.
          </p>
          <div className="mt-6">
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
