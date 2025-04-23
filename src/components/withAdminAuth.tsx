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

            if (!session.user.isAdmin) {
                router.push('/');
            }
        }, [session, status, router]);

        if (status === 'loading') {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full"></div>
                </div>
            );
        }

        if (!session?.user?.isAdmin) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
} 