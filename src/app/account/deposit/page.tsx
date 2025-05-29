'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generateDetailedTransactionId } from '@/shared/utils/orderUtils';
import { QRBankTransfer } from '@/components/payment';

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
  const searchParams = useSearchParams();
  
  // States
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'qr-banking'>('balance');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQR, setShowQR] = useState(false);
  
  // Common states
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [session, status, router]);

  // Check URL params for amount
  useEffect(() => {
    const amountParam = searchParams.get('amount');
    if (amountParam) {
      setAmount(amountParam);
    }
  }, [searchParams]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount <= 0) {
      setErrors({ amount: 'Vui lòng nhập số tiền hợp lệ' });
      return;
    }

    if (depositAmount < 10000) {
      setErrors({ amount: 'Số tiền nạp tối thiểu là 10.000 VND' });
      return;
    }

    setErrors({});

    if (paymentMethod === 'qr-banking') {
      setShowQR(true);
      return;
    }

    // Handle balance deposit (manual method)
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: depositAmount,
          method: 'manual',
          note: 'Nạp tiền thủ công'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchBalance();
        await fetchTransactions();
        setAmount('');
        setErrors({ success: `Nạp tiền thành công! Số dư mới: ${formatCurrency(data.newBalance)}` });
      } else {
        setErrors({ submit: data.error || 'Có lỗi xảy ra khi nạp tiền' });
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRSuccess = async (transactionId: string) => {
    await fetchBalance();
    await fetchTransactions();
    setShowQR(false);
    setAmount('');
    setErrors({ success: `Nạp tiền QR thành công! Mã giao dịch: ${transactionId}` });
  };

  const handleQRError = (error: string) => {
    setShowQR(false);
    setErrors({ submit: error });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // QR Banking View
  if (showQR) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Nạp tiền vào tài khoản</h1>
              <button
                onClick={() => setShowQR(false)}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                ← Quay lại
              </button>
            </div>
            <p className="text-gray-600 mt-2">Quét mã QR để chuyển khoản nhanh chóng</p>
          </div>

          <QRBankTransfer
            amount={parseFloat(amount)}
            onSuccess={handleQRSuccess}
            onError={handleQRError}
          />
        </div>
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
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Quay lại tài khoản
            </Link>
          </div>
          <p className="text-gray-600 mt-2">Nạp tiền vào tài khoản để mua sản phẩm và dịch vụ</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Main Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Balance Display */}
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">Số dư hiện tại</h3>
                  <p className="text-3xl font-bold text-teal-900">{formatCurrency(balance)}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền nạp (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền..."
                    min="10000"
                    step="1000"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Số tiền tối thiểu: 10.000 VND</p>
                </div>

                {/* Predefined Amounts */}
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
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-teal-50 hover:border-teal-300 transition-colors"
                      >
                        {formatCurrency(suggestedAmount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Phương thức nạp tiền <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="balance"
                        name="paymentMethod"
                        value="balance"
                        checked={paymentMethod === 'balance'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'balance' | 'qr-banking')}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="balance" className="ml-3 block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">Nạp tiền thủ công</div>
                            <div className="text-xs text-gray-500">Nạp trực tiếp vào số dư tài khoản</div>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="qr-banking"
                        name="paymentMethod"
                        value="qr-banking"
                        checked={paymentMethod === 'qr-banking'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'balance' | 'qr-banking')}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                      />
                      <label htmlFor="qr-banking" className="ml-3 block text-sm font-medium text-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m0 0h.01M12 4h4.01M16 4h4M4 16h4m4 0v4m0-4h.01M12 16h4.01M16 16h4M4 20h4m4 0v-4m0 4h.01M12 20h4.01M16 20h4" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">Chuyển khoản QR</div>
                            <div className="text-xs text-gray-500">Quét mã QR để chuyển khoản tự động</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error Messages */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.submit}
                  </div>
                )}

                {/* Success Messages */}
                {errors.success && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.success}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed scale-95'
                      : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-300 hover:scale-105 shadow-lg hover:shadow-teal-600/30'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {paymentMethod === 'qr-banking' ? 'Tạo mã QR' : 'Nạp tiền'}
                    </div>
                  )}
                </button>
              </form>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium text-sm mb-1">Nạp tiền an toàn</p>
                    <p className="text-blue-700 text-xs leading-relaxed">
                      Giao dịch được bảo mật tuyệt đối. Số dư sẽ được cập nhật ngay lập tức sau khi hoàn tất nạp tiền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lịch sử giao dịch</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.slice(0, 10).map((transaction) => (
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

              {transactions.length > 10 && (
                <div className="mt-4 text-center">
                  <Link
                    href="/account"
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Xem tất cả giao dịch →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 