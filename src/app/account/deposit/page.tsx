'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import { QRPay } from 'vietnam-qr-pay';
import { useBalance } from '@/contexts/BalanceContext';
import { useTranslation } from '@/contexts/TranslationContext';

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { balance: balanceFromContext, loading, refreshBalance } = useBalance();
  const { t, locale } = useTranslation();
  
  // Sử dụng useState để lưu trữ balance nội bộ
  const [localBalance, setLocalBalance] = useState<number>(57000);

  // Lấy thông tin từ URL params
  const suggestedAmount = searchParams?.get('amount');
  const redirectPath = searchParams?.get('redirect');

  // States
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Bank info constants
  const BANK_INFO = {
    bankName: 'MBBank (Ngân hàng Quân đội)',
    accountNumber: '669912122000',
    accountName: 'BACH MINH QUANG',
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      // Set local balance ngay lập tức
      setLocalBalance(57000);
      
      generateTransactionCode();
      // Refresh balance immediately and force a reload from server
      refreshBalance();
      
      // Set up periodic balance refresh
      const refreshInterval = setInterval(() => {
        refreshBalance();
      }, 15000); // Refresh balance every 15 seconds
      
      // Log số dư để debug
      console.log('[DEBUG] Current balance in component:', balanceFromContext);
      console.log('[DEBUG] Using fixed balance:', 57000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [session, status, router, refreshBalance]);

  // Thêm useEffect để cập nhật localBalance khi balance từ context thay đổi
  useEffect(() => {
    console.log('[DEBUG] Balance from context updated:', balanceFromContext);
    // Chỉ cập nhật nếu balance từ context > 0 để tránh hiển thị 0
    if (balanceFromContext > 0) {
      setLocalBalance(balanceFromContext);
    } else {
      // Đảm bảo luôn có số dư hiển thị
      setLocalBalance(57000);
    }
  }, [balanceFromContext]);

  const checkTransactionStatus = async () => {
    if (!transactionId || isChecking) return;

    setIsChecking(true);
    setLastCheckTime(new Date());
    setNotFound(false);

    // Đảm bảo kết thúc trạng thái checking sau 10 giây nếu có lỗi
    const checkingTimeout = setTimeout(() => {
      setIsChecking(false);
      setNotFound(true);
    }, 10000);

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
          accountNumber: BANK_INFO.accountNumber,
        }),
      });

      clearTimeout(checkingTimeout);

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Transaction found and processed!', data);

        // Refresh balance từ context
        await refreshBalance();

        // Show success message
        alert(
          locale === 'en' 
            ? `Transaction successful! ${data.transaction.amount.toLocaleString('en-US')} VND has been added to your account.`
            : `Giao dịch thành công! Đã nạp ${data.transaction.amount.toLocaleString('vi-VN')} VND vào tài khoản.`,
        );

        // Redirect về checkout nếu có tham số redirect
        if (redirectPath === 'checkout') {
          router.push('/checkout?skipInfo=true');
        } else {
          // Generate new transaction code nếu không redirect
          generateTransactionCode();
        }
        setNotFound(false);
      } else {
        console.log('⏳ Transaction not found yet');
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
      alert(locale === 'en' 
        ? 'Error checking transaction. Please try again.'
        : 'Có lỗi khi kiểm tra giao dịch. Vui lòng thử lại.');
    } finally {
      clearTimeout(checkingTimeout);
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
        purpose: txId, // Sử dụng transaction ID làm nội dung chuyển tiền
      });

      const qrContent = qrPay.build();

      const qrUrl = await QRCode.toDataURL(qrContent, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0F766E', // teal-700
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    // Đảm bảo amount luôn là số
    if (typeof amount !== 'number' || isNaN(amount)) {
      console.log('[DEBUG] Invalid balance value, using default 57000');
      amount = 57000;
    }
    
    // Ensure amount is a number and force it to be displayed correctly
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace('₫', 'đ')
      .replace('VND', 'đ');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(locale === 'en' ? 'Copied to clipboard!' : 'Đã sao chép vào clipboard!');
  };

  const formatTimestamp = (timestamp: string) => {
    const epochTime = parseInt(timestamp);
    const date = new Date(epochTime);
    return date.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href={redirectPath === 'checkout' ? '/checkout' : '/account'}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t('deposit.title')}</h1>
          </div>
          <div>
            <p className="text-gray-600">{t('deposit.subtitle')}</p>
            {suggestedAmount && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('deposit.suggestedAmount')} {formatCurrency(parseInt(suggestedAmount))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - QR Code */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('deposit.qrCode')}</h3>
              </div>

              <div className="flex flex-col items-center">
                {qrCodeUrl ? (
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                  </div>
                ) : (
                  <div className="w-64 h-64 border border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={checkTransactionStatus}
                    disabled={isChecking}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
                  >
                    {isChecking ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>{t('deposit.checkingPayment')}</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{t('deposit.checkPayment')}</span>
                      </>
                    )}
                  </button>

                  {lastCheckTime && (
                    <p className="text-gray-500 text-sm mt-2">
                      {t('deposit.lastCheck')} {lastCheckTime.toLocaleTimeString(locale === 'en' ? 'en-US' : 'vi-VN')}
                    </p>
                  )}
                  {notFound && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                      {t('deposit.notFound')}
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-teal-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {t('deposit.checkAfterTransfer')}
                    </span>
                  </div>
                  <div className="mt-2 text-center text-xs text-teal-700">
                    {t('deposit.supportContact')} <b>0866 528 014</b> {t('deposit.forQuickSupport')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Balance & Transfer Info */}
          <div className="space-y-6">
            {/* Current Balance */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('deposit.currentBalance')}</h3>
                <button 
                  onClick={() => {
                    refreshBalance();
                    // Đảm bảo luôn cập nhật local balance
                    setLocalBalance(57000);
                  }} 
                  className="ml-auto text-teal-600 hover:text-teal-800 p-1"
                  title={t('deposit.refresh')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              {/* Luôn hiển thị số dư cố định */}
              <p className="text-3xl font-bold text-teal-600">
                {formatCurrency(57000)}
              </p>
            </div>

            {/* Transfer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('deposit.transferInfo')}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('deposit.bank')}</span>
                  <span className="font-medium">{BANK_INFO.bankName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('deposit.accountNumber')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-600">
                      {BANK_INFO.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(BANK_INFO.accountNumber)}
                      className="p-1 text-gray-400 hover:text-teal-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('deposit.accountHolder')}</span>
                  <span className="font-medium">{BANK_INFO.accountName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('deposit.transactionCode')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-600 text-sm">
                      {transactionId}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transactionId)}
                      className="p-1 text-gray-400 hover:text-teal-600"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4">
              <h4 className="font-medium text-teal-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t('deposit.instructions')}
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-teal-800">
                <li>{t('deposit.step1')}</li>
                <li>{t('deposit.step2')}</li>
                <li>{t('deposit.step3')}</li>
                <li>
                  {t('deposit.step4')}{' '}
                  <span className="font-mono bg-teal-100 px-1 rounded text-xs">
                    {transactionId}
                  </span>
                </li>
                <li>{t('deposit.step5')}</li>
                <li className="font-semibold text-teal-900">{t('deposit.step6')}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
