'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import withAdminAuth from '@/components/withAdminAuth';
import { User, UserStats } from '@/models/UserModel';

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'admin'>('all');

  // Giả lập dữ liệu người dùng
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Nguyễn Văn Anh',
        email: 'xlab.rnd@gmail.com',
        image: undefined,
        isAdmin: true,
        isActive: true,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-05-22T00:00:00Z',
        lastLogin: '2023-06-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Trần Bình',
        email: 'tb@xlab.vn',
        image: undefined,
        isAdmin: false,
        isActive: true,
        createdAt: '2023-02-20T00:00:00Z',
        updatedAt: '2023-05-25T00:00:00Z',
        lastLogin: '2023-05-30T00:00:00Z'
      },
      {
        id: '3',
        name: 'Lê Công',
        email: 'lc@xlab.vn',
        image: undefined,
        isAdmin: false,
        isActive: false,
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-04-28T00:00:00Z',
        lastLogin: '2023-04-28T00:00:00Z'
      },
      {
        id: '4',
        name: 'Phạm Dung',
        email: 'pd@xlab.vn',
        image: undefined,
        isAdmin: false,
        isActive: true,
        createdAt: '2023-05-05T00:00:00Z',
        updatedAt: '2023-05-28T00:00:00Z',
        lastLogin: '2023-05-29T00:00:00Z'
      },
      {
        id: '5',
        name: 'Hoàng Em',
        email: 'he@xlab.vn',
        image: undefined,
        isAdmin: false,
        isActive: true,
        createdAt: '2023-05-18T00:00:00Z',
        updatedAt: '2023-05-29T00:00:00Z',
        lastLogin: '2023-05-29T00:00:00Z'
      }
    ];

    // Tính toán số liệu thống kê
    const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    
    // Tính người dùng mới trong tháng này
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsers = mockUsers.filter(user => new Date(user.createdAt) >= startOfMonth).length;

    setUsers(mockUsers);
    setStats({
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      newThisMonth: newUsers
    });
    
    setIsLoading(false);
  }, []);

  // Lọc người dùng theo tìm kiếm và bộ lọc
  const filteredUsers = users.filter(user => {
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
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Link
          href="/admin"
          className="bg-gray-100 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors text-sm"
        >
          ← Quay lại Dashboard
        </Link>
      </div>
      
      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Tổng người dùng</h3>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Đang hoạt động</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Không hoạt động</h3>
          <p className="mt-2 text-3xl font-bold text-gray-500">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-gray-500 text-sm font-medium">Mới tháng này</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.newThisMonth}</p>
        </div>
      </div>
      
      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đăng nhập cuối
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác vụ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isAdmin ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      ) : (
                        <span>Người dùng</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Chi tiết
                      </button>
                      <button className={`${
                        user.isActive 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}>
                        {user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <p>Không tìm thấy người dùng phù hợp.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default withAdminAuth(UsersPage); 