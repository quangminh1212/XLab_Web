'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generateDetailedTransactionId } from '@/shared/utils/orderUtils';
import { QRBankTransfer } from '@/components/payment';
import QRCode from 'qrcode';

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [currentTransactionId, setCurrentTransactionId] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      fetchBalance();
    }
  }, [session, status, router]);

  // Check URL params for amount
  useEffect(() => {
    const amountParam = searchParams.get('amount');
    if (amountParam) {
      setAmount(amountParam);
    }
  }, [searchParams]);

  // Auto generate QR code when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) >= 10000) {
      generateQRCode(parseFloat(amount));
    } else {
      setQrCodeUrl('');
      setCurrentTransactionId('');
    }
  }, [amount]);

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
    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      setErrors({ success: `Đã tạo QR code thành công! Mã giao dịch: ${currentTransactionId}` });
    }, 1000);
  };

  const generateQRCode = async (depositAmount: number) => {
    const transactionId = `XL-${Date.now()}`;
    
    // VietQR format
    const bankCode = 'MB';
    const accountNumber = '669912122000';
    const qrContent = `2|010|${bankCode}|${accountNumber}|BACH MINH QUANG|${depositAmount}|${transactionId}|VND`;
    
    try {
      const qrUrl = await QRCode.toDataURL(qrContent, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0F766E', // teal-700
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
      setCurrentTransactionId(transactionId);
    } catch (error) {
      console.error('Error generating QR code:', error);
      setErrors({ submit: 'Không thể tạo mã QR. Vui lòng thử lại.' });
    }
  };

  const handleQRSuccess = async (transactionId: string) => {
    await fetchBalance();
    setAmount('');
    setQrCodeUrl('');
    setCurrentTransactionId('');
    setErrors({ success: `Nạp tiền QR thành công! Mã giao dịch: ${transactionId}` });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount).replace('₫', 'đ');
  };

  const predefinedAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nạp tiền vào tài khoản</h1>
              <p className="text-gray-600 mt-2">Nạp tiền vào tài khoản để mua sản phẩm và dịch vụ</p>
            </div>
            <Link
              href="/account"
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại tài khoản
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Balance Display */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-8 text-center border border-teal-100">
              <h3 className="text-lg font-medium text-teal-800 mb-3">Số dư hiện tại</h3>
              <div className="text-4xl font-bold text-teal-900">
                {balance === 0 ? '0' : formatCurrency(balance).replace(/[^\d]/g, '')} đ
              </div>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label htmlFor="amount" className="block text-base font-medium text-gray-700 mb-3">
                    Số tiền nạp (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1043000"
                    min="10000"
                    step="1000"
                    className={`w-full px-4 py-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                      errors.amount ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    required
                  />
                  {errors.amount && (
                    <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">Số tiền tối thiểu: 10.000 VND</p>
                </div>

                {/* Predefined Amounts */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    Số tiền gợi ý
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {predefinedAmounts.map((suggestedAmount) => (
                      <button
                        key={suggestedAmount}
                        type="button"
                        onClick={() => setAmount(suggestedAmount.toString())}
                        className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          amount === suggestedAmount.toString()
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700'
                        }`}
                      >
                        {formatCurrency(suggestedAmount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !amount || parseFloat(amount) < 10000}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 transform ${
                    isLoading || !amount || parseFloat(amount) < 10000
                      ? 'bg-gray-400 cursor-not-allowed scale-95'
                      : 'bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 hover:scale-[1.02] shadow-lg hover:shadow-teal-600/30'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Nạp tiền
                    </div>
                  )}
                </button>

                {/* Error Messages */}
                {errors.submit && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.submit}
                  </div>
                )}

                {/* Success Messages */}
                {errors.success && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.success}
                  </div>
                )}
              </form>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-semibold text-base mb-1">Nạp tiền an toàn</p>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      Giao dịch được bảo mật tuyệt đối. Số dư sẽ được cập nhật ngay lập tức sau khi hoàn tất nạp tiền.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code & Info */}
          <div className="space-y-6">
            {/* QR Code Section */}
            {qrCodeUrl && currentTransactionId && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h4m4 0V4m0 0h.01M12 4h4.01M16 4h4M4 16h4m4 0v4m0-4h.01M12 16h4.01M16 16h4M4 20h4m4 0v-4m0 4h.01M12 20h4.01M16 20h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Quét mã QR để chuyển khoản</h3>
                  </div>
                  
                  {/* QR Code */}
                  <div className="relative">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                      <div className="w-64 h-64 mx-auto bg-white border rounded-lg flex items-center justify-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-56 h-56" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-teal-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Mở app ngân hàng và quét mã QR</span>
                    </div>
                    <p className="text-teal-600 text-xs mt-1">Thông tin chuyển khoản sẽ được điền tự động</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            {currentTransactionId && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h3>
                </div>

                <div className="space-y-6">
                  {/* Order Information */}
                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h4 className="font-semibold text-teal-800">Đơn hàng</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <span className="font-medium text-teal-700">{currentTransactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-bold text-teal-700 text-lg">{formatCurrency(parseFloat(amount))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h4 className="font-semibold text-blue-800">Ngân hàng</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-medium text-blue-700">MBBank (Ngân hàng Quân đội)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số TK:</span>
                        <span className="font-mono font-bold text-blue-700">669912122000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chủ TK:</span>
                        <span className="font-medium text-blue-700">Bach Minh Quang</span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Content */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold text-green-800">Nội dung chuyển khoản:</span>
                    </div>
                    <div className="bg-white border border-green-200 rounded p-3">
                      <input
                        type="text"
                        value={currentTransactionId}
                        readOnly
                        className="w-full text-center font-mono font-bold text-green-700 bg-transparent border-none focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <div className="mt-6">
                    <button
                      onClick={() => handleQRSuccess(currentTransactionId)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-teal-600/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Xác nhận đã chuyển khoản
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 