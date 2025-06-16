'use client';

import ClientLanguageSwitcherMount from '@/components/common/ClientLanguageSwitcherMount';

export default function MainLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <>
      {/* Mount the language switcher on the client side */}
      <ClientLanguageSwitcherMount />
      
      {/* Render the main content */}
      {children}
    </>
  );
} 