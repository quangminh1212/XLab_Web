'use client';

import { useIsomorphicLayoutEffect } from '@/lib';
import { setupCssErrorHandler } from '@/shared/utils/cssErrorHandler';

/**
 * Component that sets up CSS error handling
 * This prevents 404 errors for CSS files by providing alternatives
 * It should be included in the layout component
 */
const CssErrorHandler = (): null => {
  useIsomorphicLayoutEffect(() => {
    // Set up CSS error handling on the client side
    setupCssErrorHandler();
  }, []);

  return null; // This component doesn't render anything
};

export default CssErrorHandler;
