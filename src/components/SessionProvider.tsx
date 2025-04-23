'use client';

import { useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  // Add debug logging for session provider mounting
  useEffect(() => {
    console.log('SessionProvider mounted');
    
    // Immediately refresh session on client-side to avoid stale data
    const refreshSession = async () => {
      try {
        // Force refresh by triggering visibility change event
        document.dispatchEvent(new Event('visibilitychange'));
        console.log('Initial session refresh triggered');
        
        // Additional fallback refresh after 1 second
        setTimeout(() => {
          document.dispatchEvent(new Event('visibilitychange'));
          console.log('Fallback session refresh triggered');
        }, 1000);
      } catch (error) {
        console.error('Error triggering session refresh:', error);
      }
    };
    
    refreshSession();
  }, []);
  
  return (
    <NextAuthSessionProvider 
      refetchInterval={2} // Refresh session every 2 seconds while active (more aggressive)
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
} 