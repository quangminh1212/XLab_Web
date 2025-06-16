'use client';

import SuperStrict from './SuperStrict';
import AbsoluteMinimumLanguageSwitcher from './AbsoluteMinimumLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Empty div for SSR, replaced with actual content on client
  // Container div provided outside to maintain layout during SSR
  return (
    <div className={className}>
      <SuperStrict>
        <AbsoluteMinimumLanguageSwitcher />
      </SuperStrict>
    </div>
  );
} 