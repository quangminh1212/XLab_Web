'use client';

import ClientOnly from './ClientOnly';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Use null as fallback to ensure no hydration mismatch
  // This means nothing will be rendered during SSR and initial client render
  return (
    <div className={className}>
      <ClientOnly fallback={null}>
        <AbsoluteMinimumLanguageSwitcher />
      </ClientOnly>
    </div>
  );
} 