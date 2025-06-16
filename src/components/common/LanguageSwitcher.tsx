'use client';

import ClientOnly from './ClientOnly';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Use ClientOnly with a simple empty span as fallback
  // This ensures there's no complex structure during SSR that could cause hydration mismatches
  return (
    <ClientOnly fallback={<span className="mr-2" />}>
      <AbsoluteMinimumLanguageSwitcher className={className} />
    </ClientOnly>
  );
} 