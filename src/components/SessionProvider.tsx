'use client';

import { ReactNode, useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

type SessionProviderProps = {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  // Theo dõi hiệu suất session
  useEffect(() => {
    console.debug('SessionProvider mounted');
    
    return () => {
      console.debug('SessionProvider unmounted');
    };
  }, []);

  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
} 