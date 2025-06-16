'use client';

import React, { useState, useEffect } from 'react';
import LanguageSwitcherClient from './LanguageSwitcherClient';

export default function LanguageSwitcherWrapper({ className = '' }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Return a placeholder with matching structure during SSR
  if (!isMounted) {
    return <div className={`relative mr-2 ${className || ''}`.trim()}></div>;
  }
  
  // Once mounted on client, render the actual implementation
  return <LanguageSwitcherClient className={className} />;
} 