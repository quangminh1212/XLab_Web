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

            if (!session?.user) {
                router.push('/login?callbackUrl=/admin');
                return;
            }

            // Kiểm tra nếu email là xlab.rnd@gmail.com thì là admin
            if (session.user.email === 'xlab.rnd@gmail.com') {
                console.log('User is admin (by email check)');
                setIsAdmin(true);
                return;
            }

            // Kiểm tra cả giá trị isAdmin từ session
            if (session.user.isAdmin) {
                console.log('User is admin (by isAdmin flag)');
                setIsAdmin(true);
                return;
            }

            console.log('User is not admin, redirecting to home');
            router.push('/');
        }, [session, status, router]);

        if (status === 'loading') {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                </div>
            );
        }

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