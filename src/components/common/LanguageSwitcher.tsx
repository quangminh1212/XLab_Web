'use client';

import NoSSR from './NoSSR';
import PureClientLanguageSwitcher from './PureClientLanguageSwitcher';

/**
 * This is a server-safe language switcher component.
 * It uses the NoSSR wrapper to prevent any rendering on the server,
 * completely avoiding hydration mismatches.
 */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // The placeholder is an empty div with the same class structure
  // This ensures the layout doesn't shift during hydration
  return (
    <NoSSR fallback={<div className={`relative ${className}`}></div>}>
      <PureClientLanguageSwitcher className={className} />
    </NoSSR>
  );
} 