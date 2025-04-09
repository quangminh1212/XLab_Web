'use client';

export default function PureHtmlLink() {
  return (
    <a
      href="https://translate.google.com"
      id="pure-html-link"
      target="_blank"
      rel="noopener noreferrer" 
      className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-green-500 bg-green-50 hover:bg-green-100 transition-colors"
    >
      <span role="img" aria-label="Globe" className="text-lg">🌐</span>
      <span>Pure Link</span>
    </a>
  );
} 