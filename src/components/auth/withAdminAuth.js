import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

/**
 * HOC để bảo vệ các trang admin, chỉ cho phép người dùng đã đăng nhập và có quyền admin truy cập
 * @param {React.ComponentType} WrappedComponent Component cần bảo vệ
 * @returns {React.ComponentType} Component đã được bảo vệ
 */
export default function withAdminAuth(WrappedComponent) {
  return function WithAdminAuth(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const loading = status === 'loading';
    
    useEffect(() => {
      // Nếu người dùng chưa đăng nhập hoặc không phải admin, chuyển hướng đến trang đăng nhập
      if (!loading && (!session || session.user.role !== 'admin')) {
        router.replace('/login?callbackUrl=' + encodeURIComponent(router.asPath));
      }
    }, [session, loading, router]);
    
    // Nếu đang tải hoặc chưa đăng nhập hoặc không phải admin, hiển thị giao diện tải
    if (loading || !session || session.user.role !== 'admin') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Đang tải...</h2>
            <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      );
    }
    
    // Nếu đã đăng nhập và là admin, hiển thị component đã được bảo vệ
    return <WrappedComponent {...props} />;
  };
}