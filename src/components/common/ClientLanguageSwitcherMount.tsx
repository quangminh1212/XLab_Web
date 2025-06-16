'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function ClientLanguageSwitcherMount(): React.ReactNode {
  useEffect(() => {
    // Wait until next tick to ensure DOM is fully hydrated
    const timer = setTimeout(() => {
      // Only run this code on the client side
      const container = document.getElementById('language-switcher-root');
      if (container) {
        try {
          // Create a React root for the container
          const root = createRoot(container);
          
          // Render the language switcher into this root
          root.render(<AbsoluteMinimumLanguageSwitcher className="mr-2" />);
        } catch (error) {
          console.error('Error mounting language switcher:', error);
        }
      }
    }, 100); // Slightly longer timeout to ensure we're after hydration
    
    return () => clearTimeout(timer);
  }, []);
  
  // This component doesn't render anything itself
  return null;
} 