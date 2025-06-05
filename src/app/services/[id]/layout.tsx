'use client';

import Link from 'next/link';

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="bg-yellow-50 border-b border-yellow-200 p-3 text-center">
        <div className="container mx-auto">
          <p className="text-yellow-800 text-sm">
            Đường dẫn này sẽ không được hỗ trợ trong tương lai. Vui lòng sử dụng{' '}
            <Link href="/products" className="font-bold text-blue-600 hover:underline">
              /products
            </Link>{' '}
            để xem tất cả sản phẩm.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
