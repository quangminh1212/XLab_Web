'use client';

import SuperStrictWrapper from './SuperStrictWrapper';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Use SuperStrictWrapper to consistently handle SSR and hydration
  return (
    <SuperStrictWrapper className={className}>
      <AbsoluteMinimumLanguageSwitcher />
    </SuperStrictWrapper>
  );
} 