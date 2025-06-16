'use client';

import dynamic from 'next/dynamic';

// Import với ssr: false để đảm bảo component chỉ chạy ở client
const SimpleLanguageSwitcher = dynamic(
  () => import('./SimpleLanguageSwitcher'),
  { ssr: false }
);

export default function ClientLanguageSwitcher() {
  return <SimpleLanguageSwitcher />;
} 