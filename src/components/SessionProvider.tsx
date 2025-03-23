'use client';

import { ReactNode, useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

type SessionProviderProps = {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  // Monitor session performance and prevent call errors
  useEffect(() => {
    console.debug('SessionProvider mounted');
    
    // Handle any global errors that might be related to session calls
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('call')) {
        console.error('Session error intercepted:', event.error);
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      console.debug('SessionProvider unmounted');
    };
  }, []);

  return (
    <NextAuthSessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </NextAuthSessionProvider>
  );
} 