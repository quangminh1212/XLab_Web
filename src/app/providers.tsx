'use client';

import { ReactNode } from 'react';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    // Temporarily removing SessionProvider until auth is properly set up
    return <>{children}</>;
} 