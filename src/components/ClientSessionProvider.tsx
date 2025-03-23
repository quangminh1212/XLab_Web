'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <SessionProvider 
      session={null}
      refetchInterval={30}
      refetchWhenOffline={false}
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
} 