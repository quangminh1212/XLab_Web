'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

type SessionProviderProps = {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const [error, setError] = useState<Error | null>(null);
  const [hasAttemptedRecovery, setHasAttemptedRecovery] = useState(false);
  
  // Monitor session performance and prevent call errors
  useEffect(() => {
    console.log('DEBUG: SessionProvider mounting...');
    
    // Log important global objects
    console.log('DEBUG: window object:', typeof window !== 'undefined' ? 'defined' : 'undefined');
    console.log('DEBUG: NextAuthSessionProvider type:', typeof NextAuthSessionProvider);
    
    // Check if there are any prototype issues with Function.prototype.call
    try {
      console.log('DEBUG: Function.prototype.call exists:', typeof Function.prototype.call === 'function');
      
      // Create a test function to see if call works
      const testFn = function(this: any, arg: string) { return `Test ${arg}`; };
      const testResult = Function.prototype.call.call(testFn, null, 'arg');
      console.log('DEBUG: Function.prototype.call test result:', testResult);
    } catch (callError) {
      console.error('DEBUG: Error testing Function.prototype.call:', callError);
      
      // Try to recover from call error by redefining call if it's broken
      if (!hasAttemptedRecovery) {
        try {
          console.log('DEBUG: Attempting to recover from broken call method...');
          // Save original call
          const originalCall = Function.prototype.call;
          
          // Create a safe version of call
          Function.prototype.call = function(thisArg: any, ...args: any[]) {
            try {
              return originalCall.apply(this, [thisArg, ...args]);
            } catch (e) {
              console.error('DEBUG: Error in safe call:', e);
              // Fallback to apply
              return this.apply(thisArg, args);
            }
          };
          
          setHasAttemptedRecovery(true);
          console.log('DEBUG: Call method recovery attempted');
        } catch (recoveryError) {
          console.error('DEBUG: Failed to recover call method:', recoveryError);
        }
      }
    }
    
    // Handle any global errors that might be related to session calls
    const handleError = (event: ErrorEvent) => {
      console.error('DEBUG: Global error caught:', event.error);
      if (event.error?.message?.includes('call')) {
        console.error('DEBUG: Call-related error detected:', event.error.message);
        console.error('DEBUG: Error stack:', event.error.stack);
        setError(event.error);
        
        // Prevent the error from crashing the application
        event.preventDefault();
        
        // Log all prototype methods for debugging
        try {
          console.log('DEBUG: Function.prototype methods:', 
            Object.getOwnPropertyNames(Function.prototype));
          console.log('DEBUG: Object.prototype methods:', 
            Object.getOwnPropertyNames(Object.prototype));
        } catch (e) {
          console.error('DEBUG: Failed to log prototype methods:', e);
        }
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      console.log('DEBUG: SessionProvider unmounted');
    };
  }, [hasAttemptedRecovery]);

  // If we have an error and recovery attempts failed, show fallback UI
  if (error && hasAttemptedRecovery) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
        <h3 className="font-bold mb-2">Session Initialization Error</h3>
        <p>There was a problem initializing your session.</p>
        <p className="text-sm mt-2 font-mono bg-red-100 p-2 rounded">
          {error.message}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-800 transition"
        >
          Reload page
        </button>
      </div>
    );
  }

  try {
    // Carefully wrap the provider to trap any errors
    console.log('DEBUG: Rendering NextAuthSessionProvider');
    return (
      <NextAuthSessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        {children}
      </NextAuthSessionProvider>
    );
  } catch (providerError) {
    console.error('DEBUG: Error rendering SessionProvider:', providerError);
    
    // Update state and show fallback UI
    if (!error) {
      setError(providerError as Error);
    }
    
    // Return minimal fallback
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
        <p>Session temporarily unavailable. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded text-yellow-800 transition text-sm"
        >
          Reload
        </button>
      </div>
    );
  }
} 