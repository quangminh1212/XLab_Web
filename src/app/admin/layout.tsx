'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Chuyển hướng nếu không đăng nhập hoặc không phải admin
    if (status === 'loading') return;

    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    // Kiểm tra quyền admin - người dùng phải có email là xlab.rnd@gmail.com
    if (session.user?.email !== 'xlab.rnd@gmail.com') {
      router.push('/');
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Đang tải...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.email !== 'xlab.rnd@gmail.com') {
    return null; // Không hiển thị gì nếu không có quyền
  }

  return (
    <div className="admin-layout">
      <div className="min-h-screen bg-gray-100">
        <div className="flex flex-col">
          <div className="bg-teal-600 text-white p-4 shadow-md">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Quản trị viên - {session.user?.name}</h1>
              <p className="text-sm opacity-80">{session.user?.email}</p>
            </div>
          </div>
          
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 