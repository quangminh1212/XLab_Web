import { google } from 'googleapis';

// Khai báo biến môi trường ảo cho API key (trong thực tế nên dùng .env)
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Dictionary để dịch đơn giản khi không có API key
const simpleDictionary: Record<string, Record<string, string>> = {
  en: {
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
      auth: GOOGLE_API_KEY,
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