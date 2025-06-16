// This is a server component that renders a placeholder
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  // This div structure must exactly match the top-level div of the client component
  return <div className={`relative mr-2 ${className}`.trim()}></div>;
} 