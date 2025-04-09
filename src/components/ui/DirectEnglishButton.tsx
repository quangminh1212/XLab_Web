'use client';

export default function DirectEnglishButton() {
  // Sử dụng xử lý trực tiếp khi click - không sử dụng context hay state phức tạp
  function translateToEnglish() {
    console.log('DirectEnglishButton clicked');
    
    // Hard-code URL hiện tại
    const currentUrl = window.location.href;
    
    // Mở Google Translate trong tab mới - cách đơn giản nhất
    try {
      window.open(`https://translate.google.com/translate?sl=vi&tl=en&u=${encodeURIComponent(currentUrl)}`, '_self');
    } catch (err) {
      console.error('Error opening translate:', err);
      // Fallback nếu window.open không hoạt động
      window.location.href = `https://translate.google.com/?sl=vi&tl=en`;
    }
    
    // Return false để ngăn chặn sự kiện mặc định
    return false;
  }

  return (
    <button
      id="direct-english-button"
      type="button"
      onClick={translateToEnglish}
      className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <span className="text-base">🌐</span>
      <span>English</span>
    </button>
  );
} 