'use client';

/**
 * This file provides a patch for Next.js's React-Dev-Overlay component
 * that uses useLayoutEffect directly, causing SSR warnings.
 * 
 * The approach is to monkey-patch React's useLayoutEffect in Next's context.
 */

import { useEffect } from 'react';

// Define the patch function
export function patchNextDevOverlay() {
  if (typeof window !== 'undefined') {
    // Only run on client side
    try {
      // Find the Next.js DevOverlay module
      const nextModules = Object.keys(window)
        .filter(key => key.startsWith('__NEXT_'))
        .map(key => (window as any)[key]);
      
      // Find React in Next.js context
      for (const mod of nextModules) {
        if (mod && mod.React) {
          // Replace useLayoutEffect with useEffect only in Next.js's React instance
          const originalUseLayoutEffect = mod.React.useLayoutEffect;
          mod.React.useLayoutEffect = useEffect;
          
          console.log('✓ Patched Next.js DevOverlay useLayoutEffect');
          
          // Restore the original implementation when navigating away
          window.addEventListener('beforeunload', () => {
            mod.React.useLayoutEffect = originalUseLayoutEffect;
          });
          
          break;
        }
      }
    } catch (error) {
      console.error('Failed to patch Next.js DevOverlay:', error);
    }
  }
}

export default patchNextDevOverlay; 