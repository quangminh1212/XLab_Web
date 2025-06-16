'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Use a simple placeholder matching the exact structure of the client component
const DynamicLanguageSwitcherClient = dynamic(
  () => import('./LanguageSwitcherClient'),
  { 
    ssr: false,
    // Return an empty div with the exact same structure as the initial client render
    loading: () => (
      <div className="relative mr-2">
        {/* No content rendered server-side */}
      </div>
    )
  }
);

export default function NoSSRLanguageSwitcher({ className = '' }: { className?: string }) {
  return <DynamicLanguageSwitcherClient className={className} />;
} 