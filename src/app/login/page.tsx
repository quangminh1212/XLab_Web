'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  useEffect(() => {
    // Chuyển hướng người dùng đến trang đích ngay lập tức
    router.push(callbackUrl);
  }, [router, callbackUrl]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
          X
        </div>
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
          Đang chuyển hướng...
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          Vui lòng đợi trong giây lát
        </p>
        <div className="mt-4">
          <div className="w-12 h-12 mx-auto rounded-full border-t-2 border-b-2 border-teal-500 animate-spin"></div>
        </div>
      </div>
    </div>
  );
} 