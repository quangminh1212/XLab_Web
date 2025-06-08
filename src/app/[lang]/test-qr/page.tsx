'use client';

import { useState, useEffect } from 'react';
import { QRPay } from 'vietnam-qr-pay';
import QRCode from 'qrcode';

export default function TestQRPage() {
  const [qrContent, setQrContent] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');

  useEffect(() => {
    generateTestQR();
  }, []);

  const generateTestQR = async () => {
    try {
      // Test transaction ID
      const timestamp = Date.now();
      const transactionId = `${timestamp}XLABRND`;

      // Tạo VietQR chuẩn cho MBBank
      const qrPay = QRPay.initVietQR({
        bankBin: '970422', // MBBank bin code
        bankNumber: '669912122000',
        amount: '10000', // Test với 10,000 VND
        purpose: `Nap tien XLab ${transactionId}`,
      });

      const content = qrPay.build();
      setQrContent(content);

      // Tạo QR image
      const qrUrl = await QRCode.toDataURL(content, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0F766E',
          light: '#FFFFFF',
        },
      });
      setQrImageUrl(qrUrl);

      console.log('VietQR Content:', content);
    } catch (error) {
      console.error('Error generating QR:', error);
      setQrContent('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Test VietQR Code</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">QR Code Image</h2>
            {qrImageUrl ? (
              <div className="flex justify-center">
                <img src={qrImageUrl} alt="QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mx-auto">
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* QR Content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">QR Content</h2>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm break-all">
              {qrContent || 'Loading...'}
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Test Details:</h3>
              <p>
                <strong>Bank:</strong> MBBank (970422)
              </p>
              <p>
                <strong>Account:</strong> 669912122000
              </p>
              <p>
                <strong>Owner:</strong> BACH MINH QUANG
              </p>
              <p>
                <strong>Amount:</strong> 10,000 VND
              </p>
            </div>

            <button
              onClick={generateTestQR}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Generate New QR
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-yellow-700">
            <li>Quét QR code bằng app MBBank hoặc app ngân hàng khác</li>
            <li>Kiểm tra thông tin tài khoản có hiển thị đúng không</li>
            <li>Kiểm tra số tiền có đúng 10,000 VND không</li>
            <li>Kiểm tra nội dung chuyển khoản có chứa mã giao dịch không</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
