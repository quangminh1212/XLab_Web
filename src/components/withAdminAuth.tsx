'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';

export default function withAdminAuth<P extends object>(
    Component: React.ComponentType<P>
) {
    return function WithAdminAuth(props: P) {
        const { data: session, status } = useSession();
        const router = useRouter();

        console.log('Session status:', status);
        console.log('Session data:', session);

        if (status === 'loading') {
            console.log('Đang tải session...');
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner size="lg" />
                </div>
            );
        }

        // User không đăng nhập, chuyển về trang login
        if (status === 'unauthenticated' || !session) {
            console.log('Người dùng chưa đăng nhập');
            router.push('/login?callbackUrl=/admin');
            return null;
        }

        console.log('Email của người dùng:', session.user?.email);

        // Kiểm tra quyền admin
        const isAdmin = session.user?.isAdmin === true;
        console.log('Admin status:', isAdmin);

        if (!isAdmin) {
            console.log('Người dùng không có quyền admin');
            router.push('/access-denied');
            return null;
        }

        // Người dùng có quyền admin, trả về component
        return <Component {...props} />;
    };
} 