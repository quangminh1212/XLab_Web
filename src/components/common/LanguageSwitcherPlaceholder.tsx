/**
 * Empty placeholder for LanguageSwitcher during server-side rendering
 * Using an empty span with only a class ensures no hydration mismatch
 */
export default function LanguageSwitcherPlaceholder() {
  // Return absolutely nothing visible during SSR
  return <span className="mr-2" />;
} 