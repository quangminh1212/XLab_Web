'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '../common/Spinner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function withAdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAdminAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useLanguage();

    useEffect(() => {
      if (status === 'loading') return;

      if (!session) {
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`);
        return;
      }

      // Check if user is not admin or not the authorized admin email
      if (!session.user?.isAdmin || session.user?.email !== 'xlab.rnd@gmail.com') {
        router.push('/'); // Redirect to home page
      }
    }, [session, status, router, pathname]);

    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">{t('auth.loading')}</p>
          </div>
        </div>
      );
    }

    if (!session || !session.user?.isAdmin || session.user?.email !== 'xlab.rnd@gmail.com') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
