'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface UserStats {
  profile: {
    id: string;
    name: string;
    email: string;
    balance: number;
    isAdmin: boolean;
    createdAt: string;
    lastLogin: string;
  };
  transactionCount: number;
  cartItemCount: number;
  totalSpent: number;
  lastActivity: string;
  settings: {
    notifications: boolean;
    language: string;
    theme: string;
  };
}

interface MigrationData {
  success: boolean;
  totalUsers: number;
  userEmails: string[];
  stats: UserStats[];
}

export default function UserDataPage() {
  const { data: session } = useSession()
  const [migrationData, setMigrationData] = useState<MigrationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMigrating, setIsMigrating] = useState(false)

  // Load migration status on page load
  useEffect(() => {
    loadMigrationStatus()
  }, [])

  const loadMigrationStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/migrate')
      const data = await response.json()
      
      if (data.success) {
        setMigrationData(data)
      } else {
        setError(data.error || 'Failed to load migration status')
      }
    } catch (error) {
      setError('Network error')
      console.error('Error loading migration status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runMigration = async () => {
    setIsMigrating(true)
    setError('')
    
    try {
      const response = await fetch('/api/migrate', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('Migration completed successfully!')
        await loadMigrationStatus() // Reload data
      } else {
        setError(data.error || 'Migration failed')
      }
    } catch (error) {
      setError('Network error during migration')
      console.error('Migration error:', error)
    } finally {
      setIsMigrating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600">Please login to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📁 Quản lý dữ liệu người dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Hệ thống lưu trữ dữ liệu theo từng file riêng lẻ
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href="/admin"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Quay lại Admin
              </Link>
              
              <button
                onClick={runMigration}
                disabled={isMigrating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isMigrating ? '🔄 Đang migrate...' : '🚀 Chạy Migration'}
              </button>
              
              <button
                onClick={loadMigrationStatus}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? '⏳ Đang tải...' : '🔄 Tải lại'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">❌</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Migration Status */}
        {migrationData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng số User</p>
                  <p className="text-2xl font-bold text-gray-900">{migrationData.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📁</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Files được tạo</p>
                  <p className="text-2xl font-bold text-gray-900">{migrationData.stats.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng số dư</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(migrationData.stats.reduce((sum, stat) => sum + stat.profile.balance, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Stats Table */}
        {migrationData && migrationData.stats.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                📊 Thống kê chi tiết từng User
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số dư
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giao dịch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giỏ hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đã chi tiêu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoạt động cuối
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {migrationData.stats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-800">
                                {stat.profile.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {stat.profile.name}
                              {stat.profile.isAdmin && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{stat.profile.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(stat.profile.balance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stat.transactionCount} giao dịch</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{stat.cartItemCount} sản phẩm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(stat.totalSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(stat.lastActivity)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Emails List */}
        {migrationData && migrationData.userEmails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                📧 Danh sách Files User
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {migrationData.userEmails.map((email, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-green-500 mr-2">📁</span>
                    <span className="text-sm font-mono text-gray-700">
                      {email}.json
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !migrationData && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !migrationData && !error && (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📁</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có dữ liệu
              </h3>
              <p className="text-gray-600 mb-4">
                Chạy migration để chuyển đổi dữ liệu sang hệ thống file riêng lẻ
              </p>
              <button
                onClick={runMigration}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🚀 Chạy Migration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 