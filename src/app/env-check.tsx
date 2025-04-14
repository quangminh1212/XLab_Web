'use client';

import { useEffect, useState } from 'react';

export function EnvChecker() {
  const [envInfo, setEnvInfo] = useState<string>('Đang kiểm tra biến môi trường...');

  useEffect(() => {
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
      
      let info = '=== BIẾN MÔI TRƯỜNG ===\n';
      
      if (clientId) {
        info += `✅ NEXT_PUBLIC_GOOGLE_CLIENT_ID: ${clientId.substring(0, 8)}...\n`;
      } else {
        info += '❌ NEXT_PUBLIC_GOOGLE_CLIENT_ID: Không có\n';
      }
      
      if (redirectUri) {
        info += `✅ NEXT_PUBLIC_GOOGLE_REDIRECT_URI: ${redirectUri}\n`;
      } else {
        info += '❌ NEXT_PUBLIC_GOOGLE_REDIRECT_URI: Không có\n';
      }
      
      info += '\n=== THÔNG TIN BROWSER ===\n';
      info += `User Agent: ${navigator.userAgent}\n`;
      info += `Origin: ${window.location.origin}\n`;
      
      setEnvInfo(info);
    } catch (error) {
      setEnvInfo(`Lỗi: ${error}`);
    }
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4 text-left">
      <h3 className="text-sm font-medium mb-2">Kiểm tra môi trường</h3>
      <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-2 rounded border border-gray-200">
        {envInfo}
      </pre>
    </div>
  );
}

export default function EnvCheckPage() {
  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Kiểm tra biến môi trường</h1>
      <p className="mb-4 text-gray-600">
        Trang này kiểm tra các biến môi trường client-side cần thiết cho OAuth.
      </p>
      
      <EnvChecker />
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h2 className="text-lg font-medium mb-2">Các bước khắc phục</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Đảm bảo file <code>.env.local</code> hoặc <code>.env.development</code> đã cấu hình đúng các biến môi trường</li>
          <li>Đảm bảo <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> đã được cấu hình</li>
          <li>Đảm bảo <code>NEXT_PUBLIC_GOOGLE_REDIRECT_URI</code> trỏ đến callback URI chính xác</li>
          <li>Khởi động lại ứng dụng để áp dụng các thay đổi biến môi trường</li>
          <li>Kiểm tra cấu hình Google Cloud Console các URI redirect có được thiết lập đúng không</li>
        </ol>
      </div>
    </div>
  );
} 