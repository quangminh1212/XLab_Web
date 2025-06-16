// This is a server component that renders a placeholder
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Using an empty div with suppressHydrationWarning to avoid hydration mismatches
  return <div suppressHydrationWarning></div>;
} 