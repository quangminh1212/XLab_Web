'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import withAdminAuth from '@/components/withAdminAuth';
import { Product } from '@/models/ProductModel';
import { useLanguage } from '@/contexts/LanguageContext';

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
    revenue: 0,
  });
  const { language, t, locale } = useLanguage();

  // Chuyển đổi số thành định dạng tiền tệ
  // Convert number to currency format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Lấy dữ liệu sản phẩm khi component mount
  // Fetch product data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch products, users, and orders stats in parallel
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/users'),
          fetch('/api/admin/orders'),
        ]);

        if (productsRes.ok) {
          const products = await productsRes.json();
          setProducts(products);
          setStats((prev) => ({ ...prev, products: products.length }));
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setStats((prev) => ({ ...prev, users: usersData.users.length }));
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setStats((prev) => ({
            ...prev,
            orders: ordersData.stats.total,
            revenue: ordersData.stats.revenue,
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
        <h2 className="text-2xl font-bold mb-4">
          {t('admin.dashboard')}
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">
                {t('admin.products')}
              </h3>
              <p className="mt-2 text-3xl font-bold">{stats.products}</p>
              <Link
                href="/admin/products"
                className="text-teal-600 hover:text-teal-800 text-sm mt-1 inline-block"
              >
                {t('admin.coupons.edit')} →
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">
                {t('admin.users')}
              </h3>
              <p className="mt-2 text-3xl font-bold">{stats.users}</p>
              <Link
                href="/admin/users"
                className="text-teal-600 hover:text-teal-800 text-sm mt-1 inline-block"
              >
                {t('admin.coupons.edit')} →
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">
                {t('admin.orders')}
              </h3>
              <p className="mt-2 text-3xl font-bold">{stats.orders}</p>
              <Link
                href="/admin/orders"
                className="text-teal-600 hover:text-teal-800 text-sm mt-1 inline-block"
              >
                {t('admin.coupons.edit')} →
              </Link>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">
                {t('admin.orders.revenue')}
              </h3>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(stats.revenue)}</p>
              <Link
                href="/admin/orders"
                className="text-teal-600 hover:text-teal-800 text-sm mt-1 inline-block"
              >
                {t('admin.notifications.viewDetails')} →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {t('admin.products.title')}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            </div>
          ) : products.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {products.slice(0, 5).map((product) => (
                <li key={product.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(product.versions[0]?.price || 0)}
                      </p>
                    </div>
                    <div>
                      {product.isPublished ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {t('admin.products.statusPublic')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {t('admin.products.statusDraft')}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {t('admin.products.noProducts')}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">
            {t('admin.products.quickActions')}
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="block p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">
                    {t('admin.products.addNew')}
                  </h3>
                  <p className="text-sm">
                    {t('admin.products.subtitle')}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/notifications"
              className="block p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">
                    {t('admin.notifications.create')}
                  </h3>
                  <p className="text-sm">
                    {t('admin.notifications.noNotificationsDesc')}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/coupons"
              className="block p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">
                    {t('admin.coupons.createTab')}
                  </h3>
                  <p className="text-sm">
                    {t('admin.coupons.createTitle')}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="block p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">
                    {t('admin.orders.title')}
                  </h3>
                  <p className="text-sm">
                    {t('admin.orders.viewCustomerPage')}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="block p-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">
                    {t('admin.settings.title')}
                  </h3>
                  <p className="text-sm">
                    {t('admin.settings.advanced')}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/"
              className="px-4 py-2 bg-white text-teal-600 rounded hover:bg-gray-100 transition-colors duration-200"
            >
              {t('common.backToMainPage')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
