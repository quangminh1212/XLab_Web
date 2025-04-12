'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (status === 'loading') {
      return; // Chưa xác định được trạng thái, không làm gì
    }
    
    if (status === 'unauthenticated') {
      // Chuyển hướng đến trang đăng nhập nếu không có phiên
      router.push('/login?callbackUrl=/admin');
      return;
    }
    
    // Kiểm tra nếu đã xác thực nhưng không phải admin
    if (status === 'authenticated') {
      // Kiểm tra quyền admin (thêm logic tùy theo cách xác định admin trong hệ thống)
      const isAdmin = session?.user?.email?.endsWith('@xlab.vn') || false;
      
      if (!isAdmin) {
        // Không có quyền admin
        router.push('/');
        return;
      }
      
      // Người dùng là admin
      setIsAuthorized(true);
    }
    
    // Kết thúc quá trình kiểm tra, tắt trạng thái loading
    setIsLoading(false);
  }, [session, status, router]);

  // Hiển thị trạng thái loading
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    );
  }
  
  // Chỉ hiển thị nội dung nếu đã xác thực và có quyền
  if (!isAuthorized) {
    return null; // Sẽ được chuyển hướng bởi useEffect nên không cần hiển thị gì
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