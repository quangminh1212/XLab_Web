'use client';

import { useState, useEffect } from 'react';
import PureClientLanguageSwitcher from './PureClientLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Always render the same simple structure on the server
  // This ensures hydration consistency
  if (!isMounted) {
    return <div className={`relative ${className}`} style={{ minWidth: '60px', minHeight: '24px' }}></div>;
  }
  
  // Only render the actual component on the client after hydration
  return <PureClientLanguageSwitcher className={className} />;
} 