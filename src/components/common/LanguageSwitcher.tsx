'use client';

import NoSSR from './NoSSRWrapper';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <NoSSR>
      <AbsoluteMinimumLanguageSwitcher className={className} />
    </NoSSR>
  );
} 