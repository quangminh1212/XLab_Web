'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import LanguageSwitcher với client-side rendering only (không SSR)
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
  ssr: false,
  loading: () => <div className="inline-block h-8"></div>
});

interface LanguageSwitcherWrapperProps {
  className?: string;
}

const LanguageSwitcherWrapper = ({ className }: LanguageSwitcherWrapperProps) => {
  return (
    <Suspense fallback={<div className="inline-block h-8"></div>}>
      <LanguageSwitcher className={className} />
    </Suspense>
  );
};

export default LanguageSwitcherWrapper; 