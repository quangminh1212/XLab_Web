'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Create a client-only component with no SSR
const ClientLanguageSwitcher = dynamic(
  () => import('./PureClientLanguageSwitcher'),
  { ssr: false }
);

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Use client-side state to track if we're mounted
  const [isMounted, setIsMounted] = useState(false);
  
  // Only show the component after client-side hydration is complete
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // During SSR and before hydration, render an empty div with the same class structure
  if (!isMounted) {
    return <div className={`relative ${className}`}></div>;
  }
  
  // After hydration is complete, render the actual component
  return <ClientLanguageSwitcher className={className} />;
} 