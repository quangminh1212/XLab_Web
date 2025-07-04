import Link from 'next/link';
import QRCode from 'qrcode';
import { QRPay } from 'vietnam-qr-pay';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

import { useBalance } from '@/contexts/BalanceContext';
import { useLanguage } from '@/contexts/LanguageContext';

'use client';

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { balance, refreshBalance } = useBalance();
  const { t, language } = useLanguage();

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
    bankName: t('deposit.mbbank'),
    accountNumber: '669912122000',
    accountName: 'BACH MINH QUANG',
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user) {
      generateTransactionCode();
    }
  }, [session, status, router]);

  const checkTransactionStatus = async () => {
    if (!transactionId || isChecking) return;

    setIsChecking(true);
    setLastCheckTime(new Date());
    setNotFound(false);

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

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Transaction found and processed!', data);

        // Refresh balance từ context
        await refreshBalance();

        // Show success message
        alert(
          t('deposit.successMessage', { amount: formatCurrency(data.transaction.amount) })
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
      alert(t('deposit.errorMessage'));
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
    if (language === 'eng') {
      // For English, convert VND to USD (rough approximation)
      const usdAmount = amount / 24000; // Approximate conversion rate
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(usdAmount);
    } else {
      // For Vietnamese, use VND
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      })
        .format(amount)
        .replace('₫', t('deposit.currencySymbol'));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('deposit.copied'));
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
                    {t('deposit.amount')}: {formatCurrency(parseInt(suggestedAmount))}
                  </div>
                )}
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
                      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h-2v2h2v-2zM19 17h-2v2h2v-2zM17 13h-2v2h2v-2zM15 15h-2v2h2v-2zM17 17h-2v2h2v-2zM13 13h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM13 19h2v2h-2v-2zM19 15h2v2h-2v-2zM21 13h2v2h-2v-2zM19 19h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{t('deposit.qrTitle')}</h3>
                </div>

                {/* QR Code */}
                {qrCodeUrl && (
                  <div className="relative">
                    <div className="rounded-xl p-6 bg-white shadow-inner">
                      <div className="w-80 h-80 mx-auto bg-white rounded-xl flex items-center justify-center">
                        <img src={qrCodeUrl} alt="QR Code" className="w-72 h-72" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Check Button */}
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
                      {t('deposit.lastCheck')} {lastCheckTime.toLocaleTimeString('vi-VN')}
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
                    {t('deposit.supportContact')} <b>0866 528 014</b> để được hỗ trợ nhanh nhất.
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
                  <h3 className="text-lg font-semibold text-gray-900">{t('deposit.balance')}</h3>
              </div>
              <p className="text-3xl font-bold text-teal-600">{formatCurrency(balance)}</p>
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
                  <span className="text-gray-600">{t('deposit.bankName')}</span>
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
                  <span className="text-gray-600">{t('deposit.accountName')}</span>
                  <span className="font-medium">{BANK_INFO.accountName}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t('deposit.transactionCode')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-600">
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
                {t('deposit.guide')}
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
              <div className="mt-2 text-xs text-teal-900 font-semibold flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {t('deposit.reminder')} <span className="underline">{t('deposit.screenshotReminder')}</span> {t('deposit.supportReason')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
