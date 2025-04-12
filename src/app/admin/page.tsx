'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (status === 'authenticated') {
      // Admin logged in
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Trang Quản trị</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Xin chào {session?.user?.name}</h2>
        <p>Trang quản trị đang được phát triển.</p>
      </div>
    </div>
  );
} 