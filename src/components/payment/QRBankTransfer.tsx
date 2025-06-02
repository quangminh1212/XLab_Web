"use client";

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRPay, BanksObject } from 'vietnam-qr-pay';

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
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const bankInfo: BankInfo = {
    bankName: 'MBBank (Ngân hàng Quân đội)', 
    accountNumber: '669912122000',
    accountName: 'BACH MINH QUANG',
    bankCode: 'MB'
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const generateQRCode = async () => {
    // Tạo timestamp như trong deposit page
    const timestamp = Date.now();
    const newTransactionId = `${timestamp}XLABRND`;
    setTransactionId(newTransactionId);

    try {
      // Sử dụng thư viện vietnam-qr-pay để tạo VietQR chuẩn
      const qrPay = QRPay.initVietQR({
        bankBin: '970422', // MBBank bin code
        bankNumber: bankInfo.accountNumber,
        amount: amount.toString(),
        purpose: `Nap tien XLab ${newTransactionId}` // Nội dung chuyển tiền
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
      onError?.('Không thể tạo mã QR. Vui lòng thử lại.');
    }
  };

  const checkTransactionStatus = async () => {
    if (!transactionId || isChecking) return;

    setIsChecking(true);
    setLastCheckTime(new Date());
    
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
        clearInterval(intervalRef.current);
        onSuccess?.(transactionId);
      } else {
        // Hiển thị thông báo nếu chưa tìm thấy giao dịch
        alert('Chưa tìm thấy giao dịch. Vui lòng kiểm tra lại sau khi hoàn tất chuyển khoản.');
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
      alert('Có lỗi khi kiểm tra giao dịch. Vui lòng thử lại.');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    generateQRCode();

    // Chỉ countdown timer, bỏ auto check
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onError?.('Mã QR đã hết hạn. Vui lòng tạo lại.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
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
              <div className="inline-block p-6 bg-white rounded-xl shadow-inner">
                <div className="w-80 h-80 mx-auto bg-white rounded-xl flex items-center justify-center">
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
              <div className="flex justify-between items-center">
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

          {/* Check Transaction Button */}
          <div className="text-center mb-6">
            <button
              onClick={checkTransactionStatus}
              disabled={isChecking}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
            >
              {isChecking ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Đang kiểm tra giao dịch...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Kiểm tra thanh toán</span>
                </>
              )}
            </button>
            
            {lastCheckTime && (
              <p className="text-gray-500 text-sm mt-2">
                Lần kiểm tra cuối: {lastCheckTime.toLocaleTimeString('vi-VN')}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
            <h5 className="font-medium text-teal-800 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hướng dẫn chuyển khoản:
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-xs text-teal-700">
              <li>Mở app ngân hàng hoặc ví điện tử</li>
              <li>Quét mã QR hoặc nhập thông tin tài khoản</li>
              <li>Kiểm tra số tiền và mã giao dịch</li>
              <li>Xác nhận chuyển khoản</li>
              <li className="font-semibold">Nhấn nút "Kiểm tra thanh toán"</li>
            </ol>
            <div className="mt-2 text-xs text-teal-900 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Nhớ <span className="underline">chụp màn hình giao dịch</span> để gửi khi cần hỗ trợ kiểm tra nhanh!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRBankTransfer; 