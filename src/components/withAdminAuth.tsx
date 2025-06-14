'use client';

import { useEffect, ComponentType } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';

// Higher Order Component để bảo vệ các trang admin
function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
      // Kiểm tra nếu người dùng đang tải
      if (status === 'loading') return;

      // Kiểm tra nếu không có session thì chuyển hướng về trang đăng nhập
      if (!session) {
        signIn();
        return;
      }

      // Kiểm tra nếu không phải admin thì chuyển hướng về trang chủ
      // Sử dụng session.user.isAdmin thay vì role
      if (session.user && !session.user.isAdmin) {
        router.push('/');
        return;
      }
    }, [session, status, router]);

    // Hiển thị màn hình loading trong khi kiểm tra xác thực
    if (status === 'loading' || !session) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    // Kiểm tra nếu không phải admin thì hiển thị thông báo
    if (session.user && !session.user.isAdmin) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('common.accessDenied')}</h1>
          <p className="text-gray-600 mb-4">{t('common.accessDenied.message')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded hover:from-primary-700 hover:to-primary-800"
          >
            {t('common.back')}
          </button>
        </div>
      );
    }

    // Nếu người dùng là admin, hiển thị component
    return <Component {...props} />;
  };
}

export default withAdminAuth;
