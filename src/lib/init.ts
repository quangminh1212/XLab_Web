/**
 * Tệp khởi tạo cho ứng dụng
 * Import sớm để cấu hình logger và các tiện ích khác
 */

// Import logger để cấu hình console (không có timestamps)
import './logger';

// Cảnh báo runtime nếu thiếu ENV bắt buộc trong production
(() => {
  const isServer = typeof window === 'undefined';
  const isProd = process.env.NODE_ENV === 'production';
  if (!isServer) return; // chỉ chạy phía server

  const requiredEnv = ['NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'] as const;
  const missing = requiredEnv.filter((k) => {
    const v = process.env[k];
    return !v || v.trim() === '';
  });

  if (isProd && missing.length > 0) {
    console.warn(
      '[ENV WARNING] Thiếu biến môi trường bắt buộc trong production:',
      missing.join(', '),
      '\n- Hệ quả: Đăng nhập OAuth/NextAuth có thể không hoạt động đúng (hoặc kém an toàn).',
      '\n- Cách khắc phục: Thêm các biến này trong Vercel Project Settings > Environment Variables rồi redeploy.'
    );
  }
})();

// Log thông báo khởi động
console.log('🚀 Application initialization complete');

export default {};