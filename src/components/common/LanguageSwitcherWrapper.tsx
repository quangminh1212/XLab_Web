'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import LanguageSwitcher với client-side rendering only (không SSR)
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
  ssr: false,
  loading: () => <div className="relative inline-block h-8"></div>
});

interface LanguageSwitcherWrapperProps {
  className?: string;
}

const LanguageSwitcherWrapper = ({ className }: LanguageSwitcherWrapperProps) => {
  // Use a consistent wrapper that matches the client component
  return <LanguageSwitcher className={className} />;
};

export default LanguageSwitcherWrapper; 