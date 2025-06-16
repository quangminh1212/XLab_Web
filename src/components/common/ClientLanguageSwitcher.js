'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import without server-side rendering
const SimpleLanguageSwitcher = dynamic(
  () => import('./SimpleLanguageSwitcher'),
  { ssr: false }
);

export default function ClientLanguageSwitcher() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Return an empty placeholder when rendering on server
  if (!isClient) {
    return <div className="mr-2"></div>;
  }
  
  return <SimpleLanguageSwitcher />;
} 