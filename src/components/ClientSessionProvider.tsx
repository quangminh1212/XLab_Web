'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add extensive debugging in development
  useEffect(() => {
    console.log('DEBUG: ClientSessionProvider mounting...');
    
    // Log all global objects to check for undefined
    console.log('DEBUG: window object:', typeof window !== 'undefined' ? 'defined' : 'undefined');
    console.log('DEBUG: document object:', typeof document !== 'undefined' ? 'defined' : 'undefined');
    
    // Check if SessionProvider is properly defined
    console.log('DEBUG: SessionProvider type:', typeof SessionProvider);
    
    // Add a protective error boundary around component lifecycle
    try {
      setIsLoaded(true);
      console.log('DEBUG: ClientSessionProvider mounted successfully');
    } catch (error: any) {
      console.error('DEBUG: Error in ClientSessionProvider mount:', error);
    }
    
    return () => {
      try {
        console.log('DEBUG: ClientSessionProvider unmounting...');
      } catch (error: any) {
        console.error('DEBUG: Error in ClientSessionProvider unmount:', error);
      }
    };
  }, []);

  // Log any function call attempts
  const traceFunctionCalls = (obj: any, name: string) => {
    if (!obj) {
      console.error(`DEBUG: ${name} is undefined`);
      return obj;
    }
    
    // Attempt to log methods
    try {
      console.log(`DEBUG: ${name} methods:`, Object.getOwnPropertyNames(obj).filter(
        prop => typeof obj[prop] === 'function'
      ));
    } catch (err) {
      console.error(`DEBUG: Error checking ${name} methods:`, err);
    }
    
    return obj;
  };
  
  // Add protective wrapper
  try {
    console.log('DEBUG: Rendering ClientSessionProvider');
    traceFunctionCalls(SessionProvider, 'SessionProvider');
    
    // Set up global error handler for call-related errors
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event: ErrorEvent) => {
        if (event.error && event.error.message && event.error.message.includes('call')) {
          console.error('DEBUG: Global call error intercepted:', event.error);
          console.error('DEBUG: Error stack:', event.error.stack);
        }
      });
    }
    
    return (
      <SessionProvider 
        refetchInterval={0} 
        refetchOnWindowFocus={false}
      >
        {isLoaded ? (
          children
        ) : (
          <div>Loading session...</div>
        )}
      </SessionProvider>
    );
  } catch (error: any) {
    console.error('DEBUG: Error rendering SessionProvider:', error);
    // Fallback UI to prevent complete crash
    return <div>Session initialization error. Please try refreshing the page.</div>;
  }
} 