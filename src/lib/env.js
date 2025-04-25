/**
 * Cấu hình môi trường ứng dụng
 */

// Tắt SWC để sử dụng Babel thay thế
process.env.NEXT_DISABLE_SWC = '1';

// Ngăn chặn lỗi fetch experimental
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS || '--no-experimental-fetch';

// Cải thiện hiệu suất với file watching
process.env.WATCHPACK_POLLING = 'true';
process.env.NEXT_WEBPACK_USEPOLLING = '1';
process.env.CHOKIDAR_USEPOLLING = '1';

// Vô hiệu hóa Fast Refresh để tránh lỗi runtime
process.env.FAST_REFRESH = 'false';

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development' || !process.env.NODE_ENV,
}; 