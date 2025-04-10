'use client';

export default function SimpleLink() {
  return (
    <a
      href="https://www.google.com"
      id="simple-test-link"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
    >
      <span role="img" aria-label="Test">✅</span>
      <span>Test Link</span>
    </a>
  );
} 