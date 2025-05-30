"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { generateDetailedTransactionId } from '@/shared/utils/orderUtils';

interface QRBankTransferProps {
  amount: number;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
}

const QRBankTransfer = ({ amount, onSuccess, onError }: QRBankTransferProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const intervalRef = useRef<NodeJS.Timeout>();
  const checkIntervalRef = useRef<NodeJS.Timeout>();

  const bankInfo: BankInfo = {
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'CONG TY XLAB',
    bankCode: 'VCB'
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const generateQRCode = async () => {
    const newTransactionId = generateDetailedTransactionId();
    setTransactionId(newTransactionId);

    // QR content theo chuẩn VietQR
    const qrContent = `2|010|${bankInfo.bankCode}|${bankInfo.accountNumber}|${bankInfo.accountName}|${amount}|${newTransactionId}|VND`;
    
    try {
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
      onError?.('Không thể tạo mã QR. Vui lòng thử lại.');
    }
  };

  const checkTransactionStatus = async () => {
    if (!transactionId || isChecking) return;

    setIsChecking(true);
    try {
      const response = await fetch('/api/payment/check-bank-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          amount,
          bankCode: bankInfo.bankCode,
          accountNumber: bankInfo.accountNumber
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Giao dịch thành công
        clearInterval(checkIntervalRef.current);
        clearInterval(intervalRef.current);
        onSuccess?.(transactionId);
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    generateQRCode();

    // Countdown timer
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(checkIntervalRef.current);
          onError?.('Mã QR đã hết hạn. Vui lòng tạo lại.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Check transaction status every 5 seconds
    checkIntervalRef.current = setInterval(checkTransactionStatus, 5000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(checkIntervalRef.current);
    };
  }, [amount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification (you can implement this)
    alert('Đã sao chép vào clipboard!');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h-2v2h2v-2zM19 17h-2v2h2v-2zM17 13h-2v2h2v-2zM15 15h-2v2h2v-2zM17 17h-2v2h2v-2zM13 13h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM13 19h2v2h-2v-2zM19 15h2v2h-2v-2zM21 13h2v2h-2v-2zM19 19h2v2h-2v-2z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Chuyển khoản QR</h2>
            <p className="text-teal-100 text-sm">Quét mã QR để chuyển khoản tự động</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-lg mx-auto">
          {/* Countdown Timer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-800 font-medium">
                Mã QR có hiệu lực: {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            {qrCodeUrl ? (
              <div className="inline-block p-6 bg-white border border-gray-200 rounded-xl">
                <div className="w-80 h-80 mx-auto bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                  <img src={qrCodeUrl} alt="QR Code" className="w-72 h-72" />
                </div>
              </div>
            ) : (
              <div className="w-80 h-80 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
              </div>
            )}
          </div>

          {/* Bank Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Thông tin chuyển khoản</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium text-gray-800">{bankInfo.bankName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-600">{bankInfo.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(bankInfo.accountNumber)}
                    className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Chủ tài khoản:</span>
                <span className="font-medium text-gray-800">{bankInfo.accountName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-xl text-teal-800">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-gray-600">Mã giao dịch:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-600">{transactionId}</span>
                  <button
                    onClick={() => copyToClipboard(transactionId)}
                    className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              {isChecking ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <p className="text-blue-800 font-medium text-sm">
                  {isChecking ? 'Đang kiểm tra giao dịch...' : 'Chờ xác nhận thanh toán'}
                </p>
                <p className="text-blue-700 text-xs">
                  Hệ thống sẽ tự động xác nhận khi bạn hoàn tất chuyển khoản
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-2">Hướng dẫn chuyển khoản:</h5>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Mở app ngân hàng hoặc ví điện tử</li>
              <li>Quét mã QR hoặc nhập thông tin tài khoản</li>
              <li>Kiểm tra số tiền và mã giao dịch</li>
              <li>Xác nhận chuyển khoản</li>
              <li>Hệ thống sẽ tự động cập nhật số dư</li>
            </ol>
          </div>

          {/* Manual Refresh Button */}
          <div className="mt-6 text-center">
            <button
              onClick={checkTransactionStatus}
              disabled={isChecking}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isChecking ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Kiểm tra lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRBankTransfer; 