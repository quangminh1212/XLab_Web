import dynamic from 'next/dynamic';

// Import the component with ssr: false to completely skip server-side rendering
const ClientOnlyLanguageSwitcher = dynamic(
  () => import('./ClientOnlyLanguageSwitcher'),
  { 
    ssr: false,
    // Return an empty div with the same class structure during SSR
    loading: () => <div className="relative"></div>
  }
);

// Simple wrapper component to pass props
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  return <ClientOnlyLanguageSwitcher className={className} />;
} 