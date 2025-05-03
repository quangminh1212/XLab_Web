/**
 * Cấu hình giúp sử dụng Babel thay vì SWC để tránh lỗi
 */

module.exports = {
  presets: ['next/babel'],
  plugins: [],
  // Tăng tốc độ biên dịch bằng cách bỏ qua kiểm tra cú pháp
  compact: true,
  comments: false,
  minified: false,
  shouldPrintComment: () => false,
}; 