'use client';

import dynamic from 'next/dynamic';

// Import the component with SSR disabled
const AbsoluteMinimumLanguageSwitcherWithNoSSR = dynamic(
  () => import('./AbsoluteMinimumLanguageSwitcher'),
  { ssr: false }
);

interface DynamicLanguageSwitcherProps {
  className?: string;
}

/**
 * A wrapper component that dynamically imports the language switcher with SSR disabled
 * This prevents hydration errors completely by only rendering on the client side
 */
export default function DynamicLanguageSwitcher({ className = '' }: DynamicLanguageSwitcherProps) {
  return <AbsoluteMinimumLanguageSwitcherWithNoSSR className={className} />;
} 