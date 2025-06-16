/**
 * This component renders a placeholder for the language switcher 
 * with the same DOM structure as the client-side component.
 * This ensures there's no hydration mismatch between server and client.
 */
export default function LanguageSwitcherPlaceholder() {
  return (
    <div id="language-switcher-root" className="relative mr-2">
      {/* Will be filled by ClientLanguageSwitcherMount */}
    </div>
  );
} 