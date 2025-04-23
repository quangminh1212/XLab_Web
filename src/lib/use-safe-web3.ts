'use client';

import { useEffect, useState } from 'react';
import { getWeb3, waitForWeb3 } from './web3-browser';

interface SafeWeb3State {
  web3: any | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useSafeWeb3() {
  const [state, setState] = useState<SafeWeb3State>({
    web3: null,
    isReady: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const web3Instance = await waitForWeb3();
        
        if (isMounted) {
          setState({
            web3: web3Instance,
            isReady: !!web3Instance,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error initializing web3:', error);
        if (isMounted) {
          setState({
            web3: null,
            isReady: false,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
} 