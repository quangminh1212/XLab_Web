'use client';

import { useState } from 'react';

interface SheetTransaction {
  bank: string;
  date: string;
  accountNumber: string;
  accountHolder: string;
  code: string;
  description: string;
  type: string;
  amount: number;
  reference: string;
  balance: number;
}

interface TransactionResponse {
  id: string;
  amount: number;
  type: string;
  method: string;
  status: string;
  description: string;
  createdAt: string;
  verifiedAt: string;
}

export default function TestSheetsPage() {
  const [transactions, setTransactions] = useState<SheetTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [testCode, setTestCode] = useState('1748585677624-XLABRND');
  const [searchResult, setSearchResult] = useState<TransactionResponse | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/test-sheets');
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions || []);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const searchTransaction = async () => {
    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await fetch('/api/payment/check-bank-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: testCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSearchResult(data.transaction);
      } else {
        setError(data.message || 'Transaction not found');
      }
    } catch (err) {
      setError('Search error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Google Sheets Integration Test</h1>
          <p className="text-gray-600 mt-2">Test kết nối và xác thực giao dịch với Google Sheets</p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fetch All Transactions */}
            <div>
              <h3 className="font-medium mb-2">1. Lấy tất cả giao dịch</h3>
              <button
                onClick={fetchTransactions}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Đang tải...' : 'Lấy dữ liệu từ Google Sheets'}
              </button>
            </div>

            {/* Search Transaction */}
            <div>
              <h3 className="font-medium mb-2">2. Tìm giao dịch theo mã</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  placeholder="Nhập mã giao dịch"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={searchTransaction}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Tìm
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Search Result */}
          {searchResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Giao dịch được tìm thấy:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Mã giao dịch:</span> {searchResult.id}
                </div>
                <div>
                  <span className="font-medium">Số tiền:</span>{' '}
                  {formatCurrency(searchResult.amount)}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Mô tả:</span> {searchResult.description}
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span> {searchResult.status}
                </div>
                <div>
                  <span className="font-medium">Thời gian:</span>{' '}
                  {new Date(searchResult.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Danh sách giao dịch ({transactions.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngân hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={transaction.type === 'Tiền vào' ? 'bg-green-50' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.bank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'Tiền vào'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span
                          className={
                            transaction.type === 'Tiền vào' ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-800 mb-2">Hướng dẫn test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li>Nhấn "Lấy dữ liệu từ Google Sheets" để tải tất cả giao dịch</li>
            <li>Kiểm tra xem có giao dịch nào với loại "Tiền vào" không</li>
            <li>Sao chép mã giao dịch từ cột "Nội dung" của giao dịch "Tiền vào"</li>
            <li>Dán mã vào ô "Nhập mã giao dịch" và nhấn "Tìm"</li>
            <li>Hệ thống sẽ xác thực và hiển thị thông tin giao dịch nếu tìm thấy</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
