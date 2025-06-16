// This is a server component that renders a placeholder
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // Return a placeholder with matching structure during SSR
  return <div className={`relative mr-2 ${className}`.trim()}></div>;
} 