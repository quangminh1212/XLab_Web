'use client';

export default function DirectEnglishButton() {
  // Sử dụng xử lý trực tiếp khi click - không sử dụng context hay state phức tạp
  const handleTranslate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      console.log("Translating to English...");
      const currentUrl = window.location.href;
      const googleTranslateUrl = `https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(currentUrl)}`;
      
      // Mở trong tab mới thay vì thay thế tab hiện tại
      window.open(googleTranslateUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <button
      id="direct-english-button"
      type="button"
      onClick={handleTranslate}
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span className="text-base">🌐</span>
      <span>English</span>
    </button>
  );
} 