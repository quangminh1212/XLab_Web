'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function ClientLanguageSwitcherMount(): React.ReactNode {
  useEffect(() => {
    // Wait a small delay to ensure DOM is fully loaded and hydration is complete
    const timer = setTimeout(() => {
      // Only run this code on the client side
      const container = document.getElementById('language-switcher-root');
      if (container) {
        // Ensure the container is empty to avoid any hydration conflicts
        container.innerHTML = '';
        
        // Create a React root for the container
        const root = createRoot(container);
        
        // Render the language switcher into this root
        root.render(<AbsoluteMinimumLanguageSwitcher className="mr-2" />);
      }
    }, 0); // Small timeout to ensure we're after hydration
    
    return () => clearTimeout(timer);
  }, []);
  
  // This component doesn't render anything itself
  return null;
} 