'use client';

import ClientOnly from '../layout/ClientOnlyLanguageSwitcher';
import PlainLanguageSwitcher from './PlainLanguageSwitcher';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // This ensures the component is ONLY rendered on the client side and never on the server
  return (
    <ClientOnly>
      <PlainLanguageSwitcher className={className} />
    </ClientOnly>
  );
} 