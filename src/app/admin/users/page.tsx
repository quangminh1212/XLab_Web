import Link from 'next/link';
import { useState, useEffect } from 'react';

import withAdminAuth from '@/components/withAdminAuth';
import { User, UserStats } from '@/models/UserModel';
import { useLanguage } from '@/contexts/LanguageContext';

'use client';

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
  const { language } = useLanguage();

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
          {language === 'vi' ? 'Quản lý người dùng' : 'User Management'}
        </h1>
        <Link
          href="/admin"
          className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
        >
          {language === 'vi' ? '← Quay lại Dashboard' : '← Back to Dashboard'}
        </Link>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {language === 'vi' ? 'Tổng người dùng' : 'Total Users'}
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {language === 'vi' ? 'Đang hoạt động' : 'Active'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {language === 'vi' ? 'Không hoạt động' : 'Inactive'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">
            {language === 'vi' ? 'Mới tháng này' : 'New this month'}
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.newThisMonth}</p>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={language === 'vi' ? "Tìm kiếm theo tên hoặc email..." : "Search by name or email..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
              <option value="all">{language === 'vi' ? 'Tất cả' : 'All'}</option>
              <option value="active">{language === 'vi' ? 'Đang hoạt động' : 'Active'}</option>
              <option value="inactive">{language === 'vi' ? 'Không hoạt động' : 'Inactive'}</option>
              <option value="admin">Admin</option>
            </select>
          </div>
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
                    {language === 'vi' ? 'Người dùng' : 'User'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Trạng thái' : 'Status'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Vai trò' : 'Role'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Số dư' : 'Balance'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'SP đã mua' : 'Products Purchased'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Ngày tạo' : 'Created Date'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Đăng nhập cuối' : 'Last Login'}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Tác vụ' : 'Actions'}
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
                          ? (language === 'vi' ? 'Hoạt động' : 'Active') 
                          : (language === 'vi' ? 'Không hoạt động' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isAdmin ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      ) : (
                        <span>{language === 'vi' ? 'Người dùng' : 'User'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">
                        {user.balance.toLocaleString('vi-VN')} {language === 'vi' ? 'VNĐ' : 'VND'}
                      </div>
                      {user.totalSpent && user.totalSpent > 0 && (
                        <div className="text-xs text-gray-500">
                          {language === 'vi' ? 'Đã chi: ' : 'Spent: '}
                          {user.totalSpent.toLocaleString('vi-VN')} {language === 'vi' ? 'VNĐ' : 'VND'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">
                        {user.purchasedProducts || 0} {language === 'vi' ? 'sản phẩm' : 'products'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : (language === 'vi' ? 'Chưa đăng nhập' : 'Never logged in')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        {language === 'vi' ? 'Chi tiết' : 'Details'}
                      </button>
                      <button
                        className={`${
                          user.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive 
                          ? (language === 'vi' ? 'Vô hiệu hóa' : 'Disable') 
                          : (language === 'vi' ? 'Kích hoạt' : 'Enable')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p>{language === 'vi' ? 'Không tìm thấy người dùng phù hợp.' : 'No matching users found.'}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(UsersPage);
