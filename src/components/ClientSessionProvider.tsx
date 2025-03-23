'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  useEffect(() => {
    console.debug('ClientSessionProvider mounted');
    
    return () => {
      console.debug('ClientSessionProvider unmounted');
    };
  }, []);

  try {
    return (
      <SessionProvider 
        refetchInterval={0} 
        refetchOnWindowFocus={false}
      >
        {children}
      </SessionProvider>
    );
  } catch (error) {
    console.error('Error rendering SessionProvider:', error);
    
    // Fallback UI to prevent complete crash
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600 font-medium">Session initialization error</p>
        <p className="text-red-500 text-sm mt-1">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded"
        >
          Reload page
        </button>
      </div>
    );
  }
} 