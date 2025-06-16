'use client';

import dynamic from 'next/dynamic';

// Import with SSR disabled to prevent hydration errors
const DynamicSwitcher = dynamic(() => import('./DynamicLanguageSwitcher'), {
  ssr: false,
  loading: () => <div className="relative mr-2" aria-hidden="true" /> // Matches client structure
});

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return <DynamicSwitcher className={className} />;
} 