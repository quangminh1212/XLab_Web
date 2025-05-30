'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { QRPay } from 'vietnam-qr-pay';

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // States
  const [balance, setBalance] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);

  // Refs for intervals
  const checkIntervalRef = useRef<NodeJS.Timeout>();
  const balanceIntervalRef = useRef<NodeJS.Timeout>();

  // Bank info constants
  const BANK_INFO = {
    bankName: 'MBBank (Ngân hàng Quân đội)',
    accountNumber: '669912122000',
    accountName: 'BACH MINH QUANG'
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      fetchBalance();
      generateTransactionCode();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (transactionId && session?.user) {
      console.log('🚀 Setting up auto-check interval for transaction:', transactionId);
      
      // Auto-check transaction every 5 seconds
      checkIntervalRef.current = setInterval(checkTransactionStatus, 5000);
      
      // Auto-refresh balance every 10 seconds
      balanceIntervalRef.current = setInterval(fetchBalance, 10000);

      // Cleanup intervals on unmount
      return () => {
        console.log('🛑 Cleaning up intervals');
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        if (balanceIntervalRef.current) clearInterval(balanceIntervalRef.current);
      };
    }
  }, [transactionId]);

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

  const checkTransactionStatus = async () => {
    if (!transactionId || isChecking) return;

    setIsChecking(true);
    setLastCheckTime(new Date());

    try {
      console.log(`🔍 Checking transaction: ${transactionId}`);
      
      const response = await fetch('/api/payment/check-bank-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          bankCode: 'MB',
          accountNumber: BANK_INFO.accountNumber
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('✅ Transaction found and processed!', data);
        
        // Stop checking and refresh balance
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        await fetchBalance();
        
        // Show success message
        alert(`Giao dịch thành công! Đã nạp ${data.transaction.amount.toLocaleString('vi-VN')} VND vào tài khoản.`);
      } else {
        console.log('⏳ Transaction not found yet, continuing to check...');
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const generateTransactionCode = () => {
    if (!session?.user?.email) return;
    
    // Tạo timestamp và thêm suffix XLab
    const timestamp = Date.now();
    const txId = `${timestamp}XLABRND`;
    setTransactionId(txId);
    
    // Tạo QR với mã giao dịch
    generateQRCode(txId);
  };

  const generateQRCode = async (txId: string) => {
    try {
      // Sử dụng thư viện vietnam-qr-pay để tạo VietQR chuẩn cho MBBank
      const qrPay = QRPay.initVietQR({
        bankBin: '970422', // MBBank bin code
        bankNumber: BANK_INFO.accountNumber,
        purpose: txId // Sử dụng transaction ID làm nội dung chuyển tiền
      });
      
      const qrContent = qrPay.build();
      
      const qrUrl = await QRCode.toDataURL(qrContent, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0F766E', // teal-700
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount).replace('₫', 'đ');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: string) => {
    const epochTime = parseInt(timestamp);
    const date = new Date(epochTime);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

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
              <p className="text-gray-600 mt-2">Quét mã QR hoặc chuyển khoản thủ công để nạp tiền</p>
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
          {/* Left Column - QR Code */}
          <div className="space-y-6">
            {/* QR Code Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h-2v2h2v-2zM19 17h-2v2h2v-2zM17 13h-2v2h2v-2zM15 15h-2v2h2v-2zM17 17h-2v2h2v-2zM13 13h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM13 19h2v2h-2v-2zM19 15h2v2h-2v-2zM21 13h2v2h-2v-2zM19 19h2v2h-2v-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Quét mã QR để chuyển khoản</h3>
                </div>
                
                {/* QR Code */}
                {qrCodeUrl && (
                  <div className="relative">
                    <div className="rounded-xl p-6 bg-white">
                      <div className="w-80 h-80 mx-auto bg-white rounded-xl flex items-center justify-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-72 h-72" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-teal-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Mở app ngân hàng và quét mã QR</span>
                  </div>
                  <p className="text-teal-600 text-xs mt-1">Sau khi chuyển khoản, số dư sẽ được cập nhật tự động</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Balance & Transfer Info */}
          <div className="space-y-6">
            {/* Balance Display */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-8 text-center border border-teal-100">
              <h3 className="text-lg font-medium text-teal-800 mb-3">Số dư hiện tại</h3>
              <div className="text-4xl font-bold text-teal-900">
                {balance === 0 ? '0' : formatCurrency(balance).replace(/[^\d]/g, '')} đ
              </div>
            </div>

            {/* Transfer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin chuyển khoản</h3>
              </div>

              <div className="space-y-3">
                {/* Bank Info - Compact */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Ngân hàng</div>
                    <div className="font-medium text-teal-700">{BANK_INFO.bankName}</div>
                  </div>
                  
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Số tài khoản</div>
                        <div className="font-mono font-bold text-teal-700">{BANK_INFO.accountNumber}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber)}
                        className="p-2 text-teal-600 hover:bg-teal-100 rounded"
                        title="Sao chép số tài khoản"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Chủ tài khoản</div>
                        <div className="font-medium text-teal-700">{BANK_INFO.accountName}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(BANK_INFO.accountName)}
                        className="p-2 text-teal-600 hover:bg-teal-100 rounded"
                        title="Sao chép tên chủ tài khoản"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction ID - Highlighted */}
                {transactionId && (
                  <div className="bg-teal-50 rounded-lg p-4 border-l-4 border-teal-500">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-gray-500">Nội dung chuyển khoản</div>
                      <button
                        onClick={() => copyToClipboard(transactionId)}
                        className="p-1 text-teal-600 hover:bg-teal-100 rounded"
                        title="Sao chép mã giao dịch"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="font-mono font-bold text-lg text-teal-700 break-all">
                      {transactionId}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {formatTimestamp(transactionId)} • {session?.user?.email}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Status - Checking */}
            {transactionId && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {isChecking ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    ) : (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Trạng thái giao dịch</h3>
                    <p className="text-sm text-gray-600">
                      {isChecking ? 'Đang kiểm tra...' : 'Chờ xác nhận thanh toán'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tự động kiểm tra mỗi:</span>
                    <span className="text-gray-900 font-medium">5 giây</span>
                  </div>
                  
                  {lastCheckTime && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lần kiểm tra cuối:</span>
                      <span className="text-gray-900 font-medium">
                        {lastCheckTime.toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-blue-800 text-sm">
                        <p className="font-medium mb-1">Hướng dẫn:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Sau khi chuyển khoản, hệ thống sẽ tự động phát hiện</li>
                          <li>• Số dư sẽ được cập nhật ngay lập tức</li>
                          <li>• Không cần F5 hay reload trang</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={checkTransactionStatus}
                    disabled={isChecking}
                    className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isChecking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Đang kiểm tra...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Kiểm tra ngay
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 