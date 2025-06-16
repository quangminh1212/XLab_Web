'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import the component with no SSR to prevent hydration issues
const DynamicLanguageSwitcher = dynamic(
  () => import('./AbsoluteMinimumLanguageSwitcher'),
  { ssr: false }
);

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Suspense fallback={<div className="h-8 w-16"></div>}>
        <DynamicLanguageSwitcher />
      </Suspense>
    </div>
  );
} 