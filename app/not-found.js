'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-9xl font-bold text-teal-500">404</h1>
        <h2 className="text-4xl font-bold mb-4">Không tìm thấy trang</h2>
        <p className="text-lg text-gray-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-md">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
} 