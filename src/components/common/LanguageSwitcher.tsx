'use client';

import ClientOnly from './ClientOnly';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';
import LanguageSwitcherPlaceholder from './LanguageSwitcherPlaceholder';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <ClientOnly fallback={<LanguageSwitcherPlaceholder />}>
      <AbsoluteMinimumLanguageSwitcher className={className} />
    </ClientOnly>
  );
} 