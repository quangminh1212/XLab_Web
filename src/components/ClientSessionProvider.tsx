'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode, useEffect, useState } from 'react'
import { debugLog, logError } from '@/utils/debugLogger'

export default function ClientSessionProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Log detailed information about the SessionProvider and Function.prototype.call
  useEffect(() => {
    debugLog('ClientSessionProvider', 'Mounting component', {
      hasSessionProvider: typeof SessionProvider === 'function' ? 'yes' : 'no',
      sessionProviderType: typeof SessionProvider,
      sessionProviderKeys: Object.keys(SessionProvider || {}),
      nextAuthReactModule: 'next-auth/react',
    });
    
    // Log all global objects to check for undefined
    debugLog('ClientSessionProvider', 'Checking global objects', {
      windowDefined: typeof window !== 'undefined' ? 'yes' : 'no',
      documentDefined: typeof document !== 'undefined' ? 'yes' : 'no',
      // Check for React without directly referencing it
      reactInWindow: typeof window !== 'undefined' && 'React' in window ? 'yes' : 'no',
    });
    
    // Deep-check Function.prototype methods
    const functionPrototypeTest = () => {
      try {
        debugLog('ClientSessionProvider', 'Testing Function.prototype methods');
        
        // Log all properties of Function.prototype
        const functionProtoProps = Object.getOwnPropertyNames(Function.prototype);
        debugLog('ClientSessionProvider', 'Function.prototype properties', { 
          properties: functionProtoProps 
        });
        
        // Test call method
        if (typeof Function.prototype.call === 'function') {
          const testFn = function(this: any, arg: string) { 
            return `Test: ${arg}`; 
          };
          const result = Function.prototype.call.call(testFn, null, 'call test from ClientSessionProvider');
          debugLog('ClientSessionProvider', 'Function.prototype.call test', { 
            result,
            success: true
          }, 'success');
        } else {
          debugLog('ClientSessionProvider', 'Function.prototype.call is not a function', {
            typeOfCall: typeof Function.prototype.call
          }, 'error');
          
          // Try to fix by redefining
          debugLog('ClientSessionProvider', 'Attempting to restore Function.prototype.call');
          try {
            // Save a reference to apply
            const apply = Function.prototype.apply;
            
            // Redefine call in terms of apply
            Function.prototype.call = function callPolyfill(thisArg, ...args) {
              return apply.call(this, thisArg, args);
            };
            
            // Test the redefined call
            const testFn = function(this: any, arg: string) { 
              return `Fixed: ${arg}`; 
            };
            const fixedResult = Function.prototype.call.call(testFn, null, 'restore test');
            debugLog('ClientSessionProvider', 'Restored Function.prototype.call', { 
              fixedResult,
              success: true
            }, 'success');
          } catch (restoreError) {
            logError('ClientSessionProvider', restoreError);
            debugLog('ClientSessionProvider', 'Failed to restore Function.prototype.call', null, 'error');
          }
        }
      } catch (error) {
        logError('ClientSessionProvider', error);
        debugLog('ClientSessionProvider', 'Error during Function.prototype tests', null, 'error');
      }
    };
    
    // Run the function prototype test
    functionPrototypeTest();
    
    // Set loaded state
    try {
      setIsLoaded(true);
      debugLog('ClientSessionProvider', 'Component initialized successfully', null, 'success');
    } catch (error) {
      logError('ClientSessionProvider', error);
      debugLog('ClientSessionProvider', 'Error initializing component state', null, 'error');
    }
    
    // Check if we have any polyfills loaded
    if (typeof window !== 'undefined') {
      const hasCorejs = !!(window as any).core || !!(window as any)._babelPolyfill;
      const hasPromisePolyfill = typeof Promise !== 'undefined' && Promise.toString().includes('[native code]') === false;
      debugLog('ClientSessionProvider', 'Polyfill check', {
        hasCorejs,
        hasPromisePolyfill,
        hasArrayFrom: typeof Array.from === 'function',
        hasObjectAssign: typeof Object.assign === 'function',
      });
    }
    
    return () => {
      debugLog('ClientSessionProvider', 'Component unmounting');
    };
  }, []);

  // Add protective wrapper
  try {
    debugLog('ClientSessionProvider', 'Rendering SessionProvider');
    
    return (
      <SessionProvider 
        refetchInterval={0} 
        refetchOnWindowFocus={false}
      >
        {isLoaded ? (
          children
        ) : (
          <div className="p-4 bg-gray-100 rounded-md shadow-sm">
            <p className="text-gray-600 animate-pulse">Initializing session...</p>
          </div>
        )}
      </SessionProvider>
    );
  } catch (error) {
    logError('ClientSessionProvider', error);
    debugLog('ClientSessionProvider', 'Error rendering SessionProvider', null, 'error');
    
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