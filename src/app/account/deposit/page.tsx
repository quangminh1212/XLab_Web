'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generateDetailedOrderId, generateDetailedTransactionId } from '@/shared/utils/orderUtils';

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
  
  // Tab management
  const [activeTab, setActiveTab] = useState<'deposit' | 'payment'>('deposit');
  
  // Deposit states
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('bank_transfer');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  
  // Payment states
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [productName, setProductName] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  
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

  // Check URL params for payment mode
  useEffect(() => {
    const paymentAmountParam = searchParams.get('amount');
    const productParam = searchParams.get('product');
    
    if (paymentAmountParam) {
      setActiveTab('payment');
      setPaymentAmount(parseFloat(paymentAmountParam));
      setProductName(productParam || 'Sản phẩm XLab');
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (balance < paymentAmount) {
      setPaymentErrors({ balance: 'Số dư không đủ để thanh toán' });
      return;
    }

    setPaymentLoading(true);
    setPaymentErrors({});
    
    try {
      const orderId = generateDetailedOrderId();
      const response = await fetch('/api/payment/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          orderId,
          productName
        })
      });

      const data = await response.json();

      if (response.ok) {
        await fetchBalance();
        await fetchTransactions();
        
        const transactionId = data.transaction?.id || generateDetailedTransactionId();
        
        // Redirect to success page
        router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}&product=${encodeURIComponent(productName)}&amount=${paymentAmount}`);
      } else {
        setPaymentErrors({ submit: data.error || 'Có lỗi xảy ra khi thanh toán' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setPaymentErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setPaymentLoading(false);
    }
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
  const isBalanceEnough = balance >= paymentAmount;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'deposit' ? 'Nạp tiền vào tài khoản' : 'Thanh toán'}
            </h1>
            <Link
              href="/account"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              ← Quay lại tài khoản
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            {activeTab === 'deposit' 
              ? 'Nạp tiền vào tài khoản để mua sản phẩm và dịch vụ'
              : 'Sử dụng số dư tài khoản để thanh toán'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deposit'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nạp tiền
                </div>
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thanh toán
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Balance Display */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 mb-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Số dư hiện tại</h3>
                <p className="text-3xl font-bold text-teal-900">{formatCurrency(balance)}</p>
              </div>
            </div>

            {activeTab === 'deposit' ? (
              /* Deposit Tab */
              <div className="space-y-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-teal-50 hover:border-teal-300 transition-colors"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`p-4 rounded-lg ${
                      message.includes('thành công') 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-300'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : (
                      'Nạp tiền'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Payment Tab */
              <div className="space-y-6">
                {/* Payment Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sản phẩm:</span>
                      <span className="font-medium text-gray-800">{productName}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2 mt-2">
                      <span className="text-gray-800 font-medium">Tổng tiền:</span>
                      <span className="font-bold text-xl text-teal-800">{formatCurrency(paymentAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Balance Check */}
                {!isBalanceEnough && paymentAmount > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-red-800 font-medium text-sm">Số dư không đủ</p>
                        <p className="text-red-700 text-xs">
                          Bạn cần thêm {formatCurrency(paymentAmount - balance)} để hoàn tất thanh toán
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => setActiveTab('deposit')}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Nạp tiền ngay
                      </button>
                    </div>
                  </div>
                )}

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-4">
                  {paymentErrors.balance && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {paymentErrors.balance}
                    </div>
                  )}

                  {paymentErrors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {paymentErrors.submit}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={paymentLoading || !isBalanceEnough || paymentAmount <= 0}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                      paymentLoading || !isBalanceEnough || paymentAmount <= 0
                        ? 'bg-gray-400 cursor-not-allowed scale-95'
                        : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-4 focus:ring-teal-300 hover:scale-105 shadow-lg hover:shadow-teal-600/30'
                    }`}
                  >
                    {paymentLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý thanh toán...
                      </div>
                    ) : !isBalanceEnough ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Số dư không đủ
                      </div>
                    ) : paymentAmount <= 0 ? (
                      'Chưa có đơn hàng'
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Thanh toán {formatCurrency(paymentAmount)}
                      </div>
                    )}
                  </button>
                </form>

                {/* Security Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="text-blue-800 font-medium text-sm mb-1">Thanh toán an toàn</p>
                      <p className="text-blue-700 text-xs leading-relaxed">
                        Giao dịch được thực hiện ngay lập tức và bảo mật tuyệt đối. Bạn sẽ nhận được xác nhận đơn hàng sau khi thanh toán thành công.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History */}
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

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Hướng dẫn sử dụng</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">💰 Nạp tiền</h4>
              <p>Nạp tiền vào tài khoản để có số dư mua sản phẩm</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💳 Thanh toán</h4>
              <p>Sử dụng số dư để thanh toán đơn hàng ngay lập tức</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚡ Xử lý nhanh</h4>
              <p>Giao dịch được xử lý và cập nhật số dư tức thì</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔒 Bảo mật cao</h4>
              <p>Hệ thống bảo mật tuyệt đối cho mọi giao dịch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 