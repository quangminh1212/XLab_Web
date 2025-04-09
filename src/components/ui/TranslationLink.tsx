'use client';

export default function TranslationLink() {
  // Sử dụng phương pháp trực tiếp nhất - không cần hooks hay state phức tạp
  return (
    <a
      href="https://translate.google.com/translate?sl=vi&tl=en&u=https%3A%2F%2Fxlab.vn"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span className="text-base">🌐</span>
      <span>English</span>
    </a>
  );
} 