'use client';

import { useEffect } from 'react';
import { patchNextDevOverlay } from '@/lib/react-dev-overlay-patch';

/**
 * Component that applies various patches to fix Next.js errors
 * Primarily addresses the useLayoutEffect warning in development mode
 */
const ErrorPatcher = (): null => {
  useEffect(() => {
    // Only apply patches in development mode
    if (process.env.NODE_ENV === 'development') {
      // Apply the patch to fix useLayoutEffect warnings in DevOverlay
      patchNextDevOverlay();
    }
  }, []);

  return null; // This component doesn't render anything
};

export default ErrorPatcher; 