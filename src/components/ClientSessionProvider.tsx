'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  const [mounted, setMounted] = useState(false);

  // Use useEffect to ensure client-side only execution
  useEffect(() => {
    setMounted(true);
    console.debug('ClientSessionProvider mounted');
    return () => {
      console.debug('ClientSessionProvider unmounted');
    };
  }, []);

  // Only render SessionProvider on client-side to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen">
        {/* Simple fallback UI while client is loading */}
        {children}
      </div>
    );
  }

  // On client-side, wrap with SessionProvider
  try {
    // We're wrapping this in a try/catch to prevent any potential rendering errors
    return (
      <SessionProvider 
        refetchInterval={0} 
        refetchOnWindowFocus={false}
        refetchWhenOffline={false}
        session={null} // Start with no session to avoid issues with serialization
      >
        {children}
      </SessionProvider>
    );
  } catch (error) {
    console.error('Error in ClientSessionProvider:', error);
    // If there's an error in the session provider, just return the children without auth
    return <div className="min-h-screen">{children}</div>;
  }
} 