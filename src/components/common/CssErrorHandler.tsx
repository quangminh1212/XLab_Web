'use client';

import { useEffect } from 'react';
import setupCssErrorHandler from '@/shared/utils/cssErrorHandler';

/**
 * Component that sets up CSS error handling
 * This prevents 404 errors for CSS files by providing alternatives
 * It should be included in the layout component
 */
const CssErrorHandler = () => {
  useEffect(() => {
    // Set up CSS error handling on the client side
    setupCssErrorHandler();
  }, []);

  return null; // This component doesn't render anything
};

export default CssErrorHandler;
