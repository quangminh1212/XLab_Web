'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAdminAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    return function WithAdminAuth(props: P) {
        const { data: session, status } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (status === 'loading') return;

            console.log('Session status:', status);
            console.log('Session data:', session);
            console.log('User email:', session?.user?.email);
            console.log('Is admin?', session?.user?.isAdmin);

            if (!session?.user) {
                console.log('No session or user, redirecting to login');
                router.push('/login?callbackUrl=/admin');
                return;
            }

            const isAdmin = session.user.email === 'xlab.rnd@gmail.com' || session.user.isAdmin;

            if (!isAdmin) {
                console.log('User is not admin, redirecting to home');
                router.push('/');
            }
        }, [session, status, router]);

        if (status === 'loading' || !session) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                </div>
            );
        }

        // Kiểm tra quyền admin trực tiếp tại đây
        const isAdmin = session.user.email === 'xlab.rnd@gmail.com' || session.user.isAdmin;

        if (!isAdmin) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
} 