import { google } from 'googleapis';

// Khai báo biến môi trường ảo cho API key (trong thực tế nên dùng .env)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Dictionary để dịch đơn giản khi không có API key
const simpleDictionary: Record<string, Record<string, string>> = {
  en: {
    // Navigation và header
    'Trang chủ': 'Home',
    'Sản phẩm': 'Products',
    'Giới thiệu': 'About',
    'Liên hệ': 'Contact',
    'Bảo hành': 'Warranty',
    'Đăng nhập': 'Login',
    'Đăng ký': 'Register',
    'Đăng xuất': 'Logout',
    'Tài khoản của tôi': 'My Account',
    'Đơn hàng của tôi': 'My Orders',
    'Quản trị viên': 'Admin',
    'Thông báo': 'Notifications',
    'Đánh dấu tất cả đã đọc': 'Mark all as read',
    'Ngôn ngữ': 'Language',
    'Giỏ hàng': 'Cart',
    'Tiếng Việt': 'Vietnamese',
    'Tiếng Anh': 'English',
    'Đã thêm vào giỏ hàng': 'Added to cart',
    'Mua sắm': 'Shopping',
    'Giá': 'Price',
    'Số lượng': 'Quantity',
    'Đánh giá': 'Reviews',
    'Đánh giá sản phẩm': 'Product reviews',
    'Viết đánh giá': 'Write a review',
    'Gửi đánh giá': 'Submit review',
    'Đánh giá của bạn': 'Your review',
    
    // Mua hàng và thanh toán
    'Thanh toán': 'Checkout',
    'Tổng cộng': 'Total',
    'Xóa': 'Remove',
    'Xóa tất cả': 'Clear All',
    'Thêm vào giỏ hàng': 'Add to Cart',
    'Mua ngay': 'Buy Now',
    'Xem thêm': 'View More',
    'Đang tải...': 'Loading...',
    'Lưu': 'Save',
    'Hủy': 'Cancel',
    'Sửa': 'Edit',
    'Đóng': 'Close',
    'Quay lại': 'Back',
    'Tiếp theo': 'Next',
    'Gửi': 'Submit',
    
    // Câu hỏi thường gặp
    'Câu hỏi thường gặp': 'Frequently Asked Questions',
    'Giải đáp những thắc mắc phổ biến của khách hàng về sản phẩm và dịch vụ của XLab': 
    'Answers to common questions from customers about XLab products and services',
    'Làm thế nào để tải xuống phần mềm?': 'How to download the software?',
    'Làm thế nào để kích hoạt bản quyền?': 'How to activate the license?',
    'Tôi có thể sử dụng trên mấy thiết bị?': 'How many devices can I use?',
    'Làm thế nào để liên hệ hỗ trợ kỹ thuật?': 'How to contact technical support?',
    'Chính sách hoàn tiền như thế nào?': 'What is the refund policy?',
    'XLab có cung cấp giải pháp cho doanh nghiệp?': 'Does XLab provide solutions for businesses?',
    'Xem thêm câu hỏi': 'View more questions',
    
    // Từ ngữ trong hình ảnh
    'Ban có thể tải xuống phần mềm miễn phí tai trang sản phẩm tương ứng sau khi đăng nhập vào tài khoản của mình. Đối với sản phẩm trả phí, bạn cần hoàn tất thanh toán trước khi tải xuống.':
    'You can download the software for free on the corresponding product page after logging into your account. For paid products, you need to complete payment before downloading.',
    
    'Sau khi mua sản phẩm, bạn sẽ nhận được mã kích hoạt qua email. Mở ứng dụng, vào phần "Kích hoạt bản quyền" và nhập mã này để sử dụng đầy đủ tính năng.':
    'After purchasing the product, you will receive an activation code via email. Open the application, go to "Activate License" and enter this code to use all features.',
    
    'Mỗi bản quyền cho phép bạn sử dụng trên tối đa 3 thiết bị cùng một lúc. Bạn có thể quản lý danh sách thiết bị trong phần "Tài khoản" trên website.':
    'Each license allows you to use up to 3 devices at the same time. You can manage your device list in the "Account" section on the website.',
    
    'Bạn có thể liên hệ với đội ngũ hỗ trợ kỹ thuật thông qua email support@xlab.vn, hotline 1900.xxxx, hoặc chat trực tiếp trên website. Chúng tôi phản hồi trong vòng 24 giờ làm việc.':
    'You can contact our technical support team via email support@xlab.vn, hotline 1900.xxxx, or live chat on the website. We respond within 24 working hours.',
    
    'Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày kể từ ngày mua nếu sản phẩm không đáp ứng đúc như cầu của bạn. Liên hệ với bộ phận hỗ trợ để được hướng dẫn.':
    'We have a refund policy within 7 days from the purchase date if the product does not meet your needs. Contact our support team for guidance.',
    
    'Có, chúng tôi có các gói dịch vụ đặc biệt dành cho doanh nghiệp với nhiều ưu đãi về giá và hỗ trợ kỹ thuật chuyên biệt. Liên hệ với chúng tôi để được tư vấn phương án phù hợp nhất.':
    'Yes, we have special service packages for businesses with many price incentives and specialized technical support. Contact us for advice on the most suitable solution.',
    
    // Tính năng sản phẩm
    'Giá cả hợp lý': 'Reasonable price',
    'Nhiều lựa chọn phù hợp mọi ngân sách': 'Many options to suit all budgets',
    'Tích hợp AI': 'AI Integration',
    'Công nghệ AI tiên tiến hỗ trợ bạn': 'Advanced AI technology to support you',
    'Cập nhật liên tục': 'Continuous updates',
    'Luôn được cập nhật tính năng mới': 'Always updated with new features',
    'Thành tựu của chúng tôi': 'Our achievements',
    
    // Metrics
    '10,000+': '10,000+',
    'Khách hàng tin dùng': 'Trusted customers',
    '30+': '30+',
    'Giải pháp phần mềm': 'Software solutions',
    '5+': '5+',
    'Năm kinh nghiệm': 'Years of experience',

    // Thêm các phần còn thiếu dịch
    'Phần mềm': 'Software',
    'Dịch vụ': 'Services',
    'Xem tất cả': 'View all',
    'ChatGPT': 'ChatGPT',
    'Grok': 'Grok',
    'ChatGPT là một chat bot AI cực mạnh, có thể trả lời được rất nhiều câu hỏi khác nhau, hỗ trợ nhiều ngôn ngữ khác nhau, thông minh và hiệu quả': 
    'ChatGPT is an extremely powerful AI chatbot that can answer many different questions, supports multiple languages, and is intelligent and efficient',
    'Grok AI giúp tự động phân tích và xử lý dữ liệu lớn nhanh chóng, hỗ trợ ra quyết định thông minh':
    'Grok AI helps to automatically analyze and process big data quickly, supporting intelligent decision making',
    'Về XLab': 'About XLab',
    'Sản phẩm trong nước': 'Domestic Products',
    'Phát triển bởi đội ngũ kỹ sư Việt Nam': 'Developed by Vietnamese engineers',
    'Hỗ trợ 24/7': '24/7 Support',
    'Đội ngũ hỗ trợ tận tâm': 'Dedicated support team',
    'Tìm hiểu thêm': 'Learn more',
    'XLab là nền tảng cung cấp các giải pháp phần mềm tích hợp AI tiên tiến giúp người dùng nâng cao hiệu suất công việc và cuộc sống hàng ngày.':
    'XLab is a platform that provides software solutions with advanced AI integration to help users improve work efficiency and daily life.',
    'Sứ mệnh của chúng tôi là đem đến cho người Việt cơ hội tiếp cận với các công cụ phục vụ làm việc, học tập, giải trí với giá cả phải chăng và chất lượng quốc tế.':
    'Our mission is to bring Vietnamese people the opportunity to access tools for work, study, and entertainment at affordable prices and international quality.',
  },
};

/**
 * Dịch văn bản sang ngôn ngữ đích
 * @param text Văn bản cần dịch
 * @param targetLang Ngôn ngữ đích (mã ISO)
 * @returns Văn bản đã dịch
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  // Nếu ngôn ngữ là tiếng Việt hoặc chuỗi trống, trả về text gốc
  if (targetLang === 'vi' || !text) {
    return text;
  }

  // Nếu không có API key, sử dụng dictionary đơn giản
  if (!GOOGLE_API_KEY) {
    return simpleDictionary[targetLang]?.[text] || text;
  }

  try {
    // Sử dụng Google Translate API nếu có API key
    const translate = google.translate({
      version: 'v2',
      auth: GOOGLE_API_KEY as string,
    });

    const response = await translate.translations.list({
      q: [text],
      target: targetLang as string,
      format: 'text',
    });

    const translations = response.data.translations;
    if (!translations || translations.length === 0) {
      throw new Error('No translation found');
    }

    return translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to dictionary if API fails
    return simpleDictionary[targetLang]?.[text] || text;
  }
} 