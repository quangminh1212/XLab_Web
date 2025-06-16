'use client';

import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function ClientLanguageSwitcherMount(): React.ReactNode {
  useEffect(() => {
    // Only run this code on the client side
    const container = document.getElementById('language-switcher-root');
    if (container) {
      // Create a React root for the container
      const root = createRoot(container);
      
      // Render the language switcher into this root
      root.render(<AbsoluteMinimumLanguageSwitcher className="mr-2" />);
    }
  }, []);
  
  // This component doesn't render anything itself
  return null;
} 