'use client';

import React, { useEffect, useState } from 'react';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Use state to track whether we're on the client
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // On server or initial client render, return the placeholder with the same structure
  if (!isMounted) {
    return <div className="relative mr-2" aria-hidden="true" />;
  }
  
  // Only render the actual component after client-side hydration is complete
  return <AbsoluteMinimumLanguageSwitcher className={className} />;
} 