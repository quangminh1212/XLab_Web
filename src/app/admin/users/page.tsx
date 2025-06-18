'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import withAdminAuth from '@/components/withAdminAuth';
import { User, UserStats } from '@/models/UserModel';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency, convertCurrency } from '@/shared/utils/formatCurrency';

interface UserWithOrderStats extends User {
  purchasedProducts?: number;
  totalSpent?: number;
  totalOrders?: number;
}

function UsersPage() {
  const [users, setUsers] = useState<UserWithOrderStats[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'admin'>('all');
  const { t, language } = useLanguage();

  const formatAmount = (amount: number) => {
    return formatCurrency(convertCurrency(amount, language), language);
  };

  // Lấy dữ liệu người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();

        // API đã trả về dữ liệu với thống kê đơn hàng
        setUsers(data.users || []);

        // Sử dụng stats từ API
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Lọc người dùng theo tìm kiếm và bộ lọc
  const filteredUsers = users.filter((user) => {
    // Lọc theo từ khóa tìm kiếm
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    let matchesFilter = true;
    switch (filter) {
      case 'active':
        matchesFilter = user.isActive;
        break;
      case 'inactive':
        matchesFilter = !user.isActive;
        break;
      case 'admin':
        matchesFilter = user.isAdmin;
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  // Format thời gian
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {t('admin.users.title')}
        </h1>
        <Link
          href="/admin"
          className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
        >
          {t('admin.users.backToDashboard')}
        </Link>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {t('admin.users.totalUsers')}
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {t('admin.users.active')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {t('admin.users.inactive')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {t('admin.users.newThisMonth')}
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.newThisMonth}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder={t('placeholder.userEmail')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">{t('admin.users.all')}</option>
            <option value="active">{t('admin.users.active')}</option>
            <option value="inactive">{t('admin.users.inactive')}</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Danh sách người dùng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.userColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.statusColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.roleColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.balanceColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.productsColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.createdColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.lastLoginColumn')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {t('admin.users.actionsColumn')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-0">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {user.name}
                            {user.isAdmin && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.isActive 
                          ? t('admin.users.active')
                          : t('admin.users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isAdmin ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          {t('admin.users.adminRole')}
                        </span>
                      ) : (
                        <span>{t('admin.users.userRole')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">
                        {formatAmount(user.balance)}
                      </div>
                      {user.totalSpent && user.totalSpent > 0 && (
                        <div className="text-xs text-gray-500">
                          {t('admin.users.spent')}: 
                          {formatAmount(user.totalSpent)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">
                        {user.purchasedProducts || 0} {t('admin.users.products')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : t('admin.users.neverLoggedIn')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        {t('admin.users.details')}
                      </button>
                      <button
                        className={`${
                          user.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive 
                          ? t('admin.users.disable')
                          : t('admin.users.enable')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p>{t('admin.users.noMatchingUsers')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(UsersPage);
