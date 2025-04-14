import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Không tìm thấy trang</h2>
          <p className="mt-2 text-base text-gray-500">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 