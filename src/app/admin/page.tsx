'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import withAdminAuth from '@/components/withAdminAuth';
import { Product } from '@/models/ProductModel';

interface Stats {
  products: number;
  users: number;
  orders: number;
  revenue: number;
}

function AdminDashboard() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });

  // Chuyển đổi số thành định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  // Lấy dữ liệu sản phẩm khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch products, users, and orders stats in parallel
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/users'),
          fetch('/api/admin/orders')
        ]);

        if (productsRes.ok) {
          const products = await productsRes.json();
          setProducts(products);
          setStats(prev => ({ ...prev, products: products.length }));
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setStats(prev => ({ ...prev, users: usersData.users.length }));
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setStats(prev => ({
            ...prev,
            orders: ordersData.stats.total,
            revenue: ordersData.stats.revenue
          }));
        }

      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Thống kê tổng quan</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Sản phẩm</h3>
              <p className="mt-2 text-3xl font-bold">{stats.products}</p>
              <Link href="/admin/products" className="text-primary-600 hover:text-primary-800 text-sm mt-1 inline-block">
                Quản lý →
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Người dùng</h3>
              <p className="mt-2 text-3xl font-bold">{stats.users}</p>
              <Link href="/admin/users" className="text-primary-600 hover:text-primary-800 text-sm mt-1 inline-block">
                Quản lý →
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Đơn hàng</h3>
              <p className="mt-2 text-3xl font-bold">{stats.orders}</p>
              <Link href="/admin/orders" className="text-primary-600 hover:text-primary-800 text-sm mt-1 inline-block">
                Quản lý →
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Doanh thu</h3>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(stats.revenue)}</p>
              <Link href="/admin/orders" className="text-primary-600 hover:text-primary-800 text-sm mt-1 inline-block">
                Xem chi tiết →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Sản phẩm mới nhất</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {products.slice(0, 5).map((product) => (
                <li key={product.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{formatCurrency(product.versions[0]?.price || 0)}</p>
                    </div>
                    <div>
                      {product.isPublished ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Công khai</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Nháp</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">Chưa có sản phẩm nào</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Tác vụ nhanh</h2>
          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="block p-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <h3 className="font-medium">Thêm sản phẩm mới</h3>
                  <p className="text-sm">Tạo và quản lý sản phẩm của bạn</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="block p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h3 className="font-medium">Quản lý người dùng</h3>
                  <p className="text-sm">Xem và quản lý tài khoản người dùng</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="block p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <div>
                  <h3 className="font-medium">Quản lý đơn hàng</h3>
                  <p className="text-sm">Xem và xử lý đơn hàng của khách hàng</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/user-data"
              className="block p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                <div>
                  <h3 className="font-medium">📁 Dữ liệu người dùng</h3>
                  <p className="text-sm">Quản lý file riêng lẻ và giỏ hàng</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard); 