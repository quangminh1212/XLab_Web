'use client';

export default function HardcodedLink() {
  return (
    <a
      href="https://translate.google.com/translate?sl=vi&tl=en&u=https%3A%2F%2Fxlab.vn"
      id="hardcoded-link"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-red-500 bg-red-50 hover:bg-red-100 transition-colors"
    >
      <span role="img" aria-label="Globe" className="text-lg">🌐</span>
      <span>XLab English</span>
    </a>
  );
} 