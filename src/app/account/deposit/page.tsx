'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // States
  const [balance, setBalance] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');

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

  const generateTransactionCode = () => {
    if (!session?.user?.email) return;
    
    // Tạo timestamp epoch
    const timestamp = Date.now();
    
    // Lấy phần username từ email (trước @)
    const username = session.user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Tạo mã giao dịch: TIMESTAMP-USERNAME
    const txId = `${timestamp}-${username}`;
    setTransactionId(txId);
    
    // Tạo QR với mã giao dịch
    generateQRCode(txId);
  };

  const generateQRCode = async (txId: string) => {
    try {
      // VietQR format với transaction ID
      const qrContent = `MB|${BANK_INFO.accountNumber}|${BANK_INFO.accountName}|0|${txId}|VND`;
      
      const qrUrl = await QRCode.toDataURL(qrContent, {
        width: 256,
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
    const epochTime = parseInt(timestamp.split('-')[0]);
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
          {/* Left Column - Balance & QR */}
          <div className="space-y-6">
            {/* Balance Display */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-8 text-center border border-teal-100">
              <h3 className="text-lg font-medium text-teal-800 mb-3">Số dư hiện tại</h3>
              <div className="text-4xl font-bold text-teal-900">
                {balance === 0 ? '0' : formatCurrency(balance).replace(/[^\d]/g, '')} đ
              </div>
            </div>

            {/* Transaction Info */}
            {transactionId && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mã giao dịch</h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Mã chuyển khoản:</span>
                      <button
                        onClick={() => copyToClipboard(transactionId)}
                        className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                        title="Sao chép mã giao dịch"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    <div className="font-mono text-purple-700 font-bold text-sm break-all bg-white p-3 rounded border">
                      {transactionId}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Thời gian tạo:</span>
                      <span className="font-medium text-gray-700">{formatTimestamp(transactionId)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Người tạo:</span>
                      <span className="font-medium text-gray-700">{session?.user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Section */}
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
                {qrCodeUrl && (
                  <div className="relative">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                      <div className="w-64 h-64 mx-auto bg-white border rounded-lg flex items-center justify-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-56 h-56" />
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

          {/* Right Column - Bank Info */}
          <div className="space-y-6">
            {/* Bank Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Thông tin ngân hàng</h3>
              </div>

              <div className="space-y-4">
                {/* Bank Name */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Ngân hàng:</span>
                    <span className="font-medium text-blue-700">{BANK_INFO.bankName}</span>
                  </div>
                </div>

                {/* Account Number */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 text-lg">{BANK_INFO.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(BANK_INFO.accountNumber)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Sao chép số tài khoản"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Name */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Chủ tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-700">{BANK_INFO.accountName}</span>
                      <button
                        onClick={() => copyToClipboard(BANK_INFO.accountName)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Sao chép tên chủ tài khoản"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transfer Content */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-700">{transactionId}</span>
                      <button
                        onClick={() => copyToClipboard(transactionId)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Sao chép nội dung chuyển khoản"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hướng dẫn chuyển khoản</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <span>Quét mã QR bằng app ngân hàng hoặc chuyển khoản thủ công</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <span>Nhập số tiền muốn nạp (tối thiểu 10.000 VND)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <span>Sử dụng đúng mã giao dịch làm nội dung chuyển khoản</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <span>Số dư sẽ được cập nhật tự động trong vòng 1-5 phút</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-blue-800 font-semibold text-base mb-1">Nạp tiền an toàn</p>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Mã giao dịch được tạo duy nhất theo thời gian và tài khoản. Hệ thống tự động xác thực và cập nhật số dư ngay sau khi nhận được chuyển khoản.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 