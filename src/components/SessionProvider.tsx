'use client';

import { useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  // Add debug logging for session provider mounting
  useEffect(() => {
    console.log('SessionProvider mounted');
    
    // Force a session refresh on component mount
    const refreshSession = async () => {
      try {
        const event = new Event('visibilitychange');
        document.dispatchEvent(event);
        console.log('Session refresh triggered');
      } catch (error) {
        console.error('Error triggering session refresh:', error);
      }
    };
    
    refreshSession();
  }, []);
  
  return (
    <NextAuthSessionProvider 
      refetchInterval={5} // Refresh session every 5 seconds when active
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
} 