'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface UserVoucher {
  code: string;
  name: string;
  usedCount: number;
  lastUsed?: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function UsedVouchersPage() {
  const { data: session, status } = useSession();
  const [vouchers, setVouchers] = useState<UserVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (status !== 'authenticated') return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/user/vouchers/sync', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Không thể tải dữ liệu voucher');
        }

        const data = await response.json();
        setVouchers(data.vouchers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải voucher');
        console.error('Error fetching vouchers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVouchers();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="mx-auto py-8 px-0 sm:px-4 min-h-screen max-w-[98%] sm:max-w-xl md:max-w-2xl">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="mx-auto py-8 px-0 sm:px-4 min-h-screen max-w-[98%] sm:max-w-xl md:max-w-2xl">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            Bạn cần đăng nhập để xem voucher đã sử dụng
          </h2>
          <Link
            href="/login"
            className="inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-0 sm:px-4 min-h-screen max-w-full sm:max-w-xl md:max-w-2xl">
      <h1 className="text-2xl font-bold text-primary-700 mb-6 text-center text-balance">Voucher đã sử dụng</h1>

      <div className="mb-4 flex justify-between items-center">
        <Link
          href="/vouchers"
          className="text-primary-600 hover:text-primary-800 transition-colors"
        >
          &larr; Xem voucher hiện có
        </Link>
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              const response = await fetch('/api/user/vouchers/sync', {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Đồng bộ thất bại');
              }
              const data = await response.json();
              setVouchers(data.vouchers || []);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Đồng bộ thất bại');
              console.error('Error syncing vouchers:', err);
            } finally {
              setIsLoading(false);
            }
          }}
          className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-md hover:bg-primary-100 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-gray-100">
          <p className="mb-2">Bạn chưa sử dụng voucher nào.</p>
          <Link href="/vouchers" className="text-primary-600 hover:underline">
            Xem các voucher có sẵn
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600">
            Danh sách các voucher mà bạn đã sử dụng trong quá trình mua hàng.
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mã voucher
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tên
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số lần sử dụng
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lần cuối sử dụng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vouchers.map((voucher) => (
                  <tr key={voucher.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {voucher.code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {voucher.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {voucher.usedCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(voucher.lastUsed || '')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
