'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserDataViewerProps {
  className?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  isActive: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface UserSession {
  id: string;
  loginTime: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

interface UserActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface UserTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface UserDataResponse {
  profile: UserProfile;
  sessions: UserSession[];
  activities: UserActivity[];
  transactions: UserTransaction[];
  settings: {
    notifications: boolean;
    emailAlerts: boolean;
    twoFactorAuth: boolean;
  };
  stats: {
    activeSessions: number;
    totalActivities: number;
    totalTransactions: number;
    lastLogin: string;
    memberSince: string;
    currentBalance: number;
  };
  metadata: {
    lastBackup: string;
    dataVersion: string;
    checksum: string;
    dataIntegrity: boolean;
  };
}

export default function UserDataViewer({ className = '' }: UserDataViewerProps) {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchEmail, setSearchEmail] = useState('');

  const searchUserData = async () => {
    if (!searchEmail.trim()) {
      setError('Vui lòng nhập email người dùng');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/admin/user-data?email=${encodeURIComponent(searchEmail)}&action=info`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error: any) {
      setError(error.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const checkDataIntegrity = async () => {
    if (!searchEmail.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/user-data?email=${encodeURIComponent(searchEmail)}&action=integrity`,
      );
      const data = await response.json();

      if (data.isValid) {
        alert('✅ Dữ liệu người dùng toàn vẹn');
      } else {
        alert('⚠️ Cảnh báo: Dữ liệu có thể bị thay đổi');
      }
    } catch (error) {
      alert('❌ Lỗi khi kiểm tra tính toàn vẹn dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (!session?.user?.isAdmin) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-700">⛔ Chỉ admin mới có thể truy cập tính năng này</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Truy vấn dữ liệu người dùng</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Nhập email người dùng..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && searchUserData()}
          />
          <button
            onClick={searchUserData}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '⏳' : '🔍'} Tìm kiếm
          </button>
          {userData && (
            <button
              onClick={checkDataIntegrity}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              ✅ Kiểm tra
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}
      </div>

      {userData && (
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">👤 Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>ID:</strong> {userData.profile.id}
                </p>
                <p>
                  <strong>Tên:</strong> {userData.profile.name}
                </p>
                <p>
                  <strong>Email:</strong> {userData.profile.email}
                </p>
                <p>
                  <strong>Admin:</strong> {userData.profile.isAdmin ? 'Có' : 'Không'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Số dư:</strong> {formatCurrency(userData.profile.balance)}
                </p>
                <p>
                  <strong>Tham gia:</strong> {formatDateTime(userData.profile.createdAt)}
                </p>
                <p>
                  <strong>Đăng nhập cuối:</strong>{' '}
                  {userData.profile.lastLogin
                    ? formatDateTime(userData.profile.lastLogin)
                    : 'Chưa có'}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {userData.profile.isActive ? '✅ Hoạt động' : '❌ Không hoạt động'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Thống kê</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{userData.stats.activeSessions}</p>
                <p className="text-sm text-gray-600">Sessions hoạt động</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {userData.stats.totalActivities}
                </p>
                <p className="text-sm text-gray-600">Tổng hoạt động</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {userData.stats.totalTransactions}
                </p>
                <p className="text-sm text-gray-600">Tổng giao dịch</p>
              </div>
            </div>
          </div>

          {/* Data Integrity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔒 Tính toàn vẹn dữ liệu</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Phiên bản:</strong> {userData.metadata.dataVersion}
                </p>
                <p>
                  <strong>Backup cuối:</strong> {formatDateTime(userData.metadata.lastBackup)}
                </p>
              </div>
              <div>
                <p>
                  <strong>Checksum:</strong>{' '}
                  <code className="text-xs">{userData.metadata.checksum.substring(0, 16)}...</code>
                </p>
                <p>
                  <strong>Tính toàn vẹn:</strong>{' '}
                  {userData.metadata.dataIntegrity ? '✅ OK' : '⚠️ Cảnh báo'}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Hoạt động gần đây</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userData.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-600">Loại: {activity.type}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Giao dịch gần đây</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userData.transactions.map((transaction) => (
                <div key={transaction.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {transaction.type} - {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🖥️ Sessions gần đây</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {userData.sessions.map((session) => (
                <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Session {session.id}</p>
                      <p className="text-sm text-gray-600">IP: {session.ipAddress || 'N/A'}</p>
                      {session.userAgent && (
                        <p className="text-xs text-gray-500 truncate max-w-md">
                          {session.userAgent}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          session.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {session.isActive ? 'Hoạt động' : 'Đã kết thúc'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(session.loginTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
