'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('bank_transfer');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [session, status, router]);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/user/balance');
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/user/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (parseFloat(amount) < 10000) {
      setMessage('Số tiền nạp tối thiểu là 10.000 VND');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method,
          note
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Nạp tiền thành công! Số dư mới: ${formatCurrency(data.newBalance)}`);
        setAmount('');
        setNote('');
        await fetchBalance();
        await fetchTransactions();
      } else {
        setMessage(data.error || 'Có lỗi xảy ra khi nạp tiền');
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      setMessage('Có lỗi xảy ra khi nạp tiền');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Nạp tiền vào tài khoản</h1>
            <Link
              href="/account"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Quay lại tài khoản
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            Nạp tiền vào tài khoản để mua sản phẩm và dịch vụ
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form nạp tiền */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin nạp tiền</h2>
            
            {/* Hiển thị số dư hiện tại */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-primary-700 font-medium">Số dư hiện tại:</span>
                <span className="text-2xl font-bold text-primary-900">
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            <form onSubmit={handleDeposit} className="space-y-6">
              {/* Số tiền */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền nạp (VND)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền..."
                  min="10000"
                  step="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Số tiền tối thiểu: 10.000 VND</p>
              </div>

              {/* Số tiền gợi ý */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền gợi ý
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((suggestedAmount) => (
                    <button
                      key={suggestedAmount}
                      type="button"
                      onClick={() => setAmount(suggestedAmount.toString())}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-primary-50 hover:border-primary-300 transition-colors"
                    >
                      {formatCurrency(suggestedAmount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                  <option value="momo">Ví MoMo</option>
                  <option value="zalopay">ZaloPay</option>
                  <option value="credit_card">Thẻ tín dụng</option>
                </select>
              </div>

              {/* Ghi chú */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Thông báo */}
              {message && (
                <div className={`p-4 rounded-lg ${message.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Nạp tiền'}
              </button>
            </form>
          </div>

          {/* Lịch sử giao dịch */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Lịch sử giao dịch</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium ${
                        transaction.type === 'deposit' 
                          ? 'text-green-600' 
                          : transaction.type === 'purchase'
                          ? 'text-red-600'
                          : 'text-blue-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+ ' : '- '}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status === 'completed' ? 'Hoàn thành' : 
                         transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{transaction.description}</p>
                    <p className="text-gray-500 text-xs">{formatDate(transaction.createdAt)}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>Chưa có giao dịch nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin hướng dẫn */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Hướng dẫn nạp tiền</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">📱 Chuyển khoản ngân hàng</h4>
              <p>Chuyển khoản qua internet banking hoặc tại ATM</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💳 Ví điện tử</h4>
              <p>Thanh toán qua MoMo, ZaloPay nhanh chóng</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚡ Xử lý tự động</h4>
              <p>Tiền sẽ được nạp vào tài khoản ngay lập tức</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔒 Bảo mật cao</h4>
              <p>Giao dịch được mã hóa và bảo mật tuyệt đối</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 