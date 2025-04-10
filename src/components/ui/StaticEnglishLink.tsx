'use client';

export default function StaticEnglishLink() {
  // Điều này sẽ chỉ chạy một lần trên server và một lần trên client
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const translateUrl = currentUrl ? `https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(currentUrl)}` : '#';

  return (
    <a
      href={translateUrl || 'https://translate.google.com'}
      id="static-english-link"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
      style={{ background: 'white' }}
    >
      <span role="img" aria-label="Globe" className="text-lg">🌐</span>
      <span>Static English</span>
    </a>
  );
} 