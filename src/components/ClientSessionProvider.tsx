'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  // Add debugging in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('ClientSessionProvider mounted');
    }
    
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('ClientSessionProvider unmounted');
      }
    };
  }, []);

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  )
} 