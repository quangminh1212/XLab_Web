'use client';

// Xử lý tabs trong trang chi tiết sản phẩm
export function initProductTabs() {
  if (typeof document !== 'undefined') {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Đảm bảo có các tab buttons trên trang
    if (tabButtons.length === 0) return;

    // Xử lý click vào tab
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Xóa trạng thái active từ tất cả các tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Thiết lập tab được chọn là active
        button.classList.add('active');
        tabContents[index].classList.add('active');
      });
    });

    // Xử lý các câu hỏi FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const faqAnswer = faqItem.querySelector('.faq-answer');
        const faqToggle = question.querySelector('.faq-toggle');

        // Toggle hiển thị câu trả lời
        if (faqAnswer.style.display === 'block') {
          faqAnswer.style.display = 'none';
          faqToggle.textContent = '+';
        } else {
          faqAnswer.style.display = 'block';
          faqToggle.textContent = '-';
        }
      });
    });

    // Ẩn tất cả các câu trả lời FAQ ban đầu
    document.querySelectorAll('.faq-answer').forEach(answer => {
      answer.style.display = 'none';
    });

    // Xử lý hình ảnh thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Xóa active từ tất cả thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        // Thêm active cho thumbnail được click
        thumb.classList.add('active');
      });
    });
  }
}

// Tự động chạy khi component được mount
export function ProductTabsInit() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', initProductTabs);
  }
  return null;
} 