/**
 * Tệp này được sử dụng để ngăn chặn các cảnh báo không cần thiết từ Next.js và Webpack
 * Đặc biệt hữu ích khi dev Next.js 15.x
 */

// Tạo timestamp cho logs (trước khi import logger để không bị ghi đè)
const getTimestamp = () => {
  const now = new Date();
  return `[${now.toISOString().replace('T', ' ').slice(0, -1)}]`;
};

// Lưu các hàm console gốc
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Các mẫu cảnh báo cần lọc
const suppressPatterns = [
  /webpack\.cache\.PackFileCacheStrategy/,
  /\[webpack\.cache\.PackFileCacheStrategy\]/,
  /Failed to update pack file/,
  /DeprecationWarning/,
  /Caching failed for pack/,
  /ENOENT: no such file or directory/,
  /unhandledRejection:/,
  /\[next-auth\]\[warn\]/,
];

// Thay thế console.error để lọc các cảnh báo không mong muốn
console.error = function (...args) {
  // Kiểm tra xem thông báo lỗi có khớp với bất kỳ mẫu nào cần lọc
  const errorMessage = args.length > 0 ? String(args[0]) : '';

  const shouldSuppressError = suppressPatterns.some((pattern) => pattern.test(errorMessage));

  // Nếu không cần lọc, ghi log bình thường với timestamp
  if (!shouldSuppressError) {
    originalConsoleError.apply(console, [getTimestamp(), ...args]);
  }
};

// Thay thế console.warn để lọc các cảnh báo không mong muốn
console.warn = function (...args) {
  // Kiểm tra xem thông báo cảnh báo có khớp với bất kỳ mẫu nào cần lọc
  const warnMessage = args.length > 0 ? String(args[0]) : '';

  const shouldSuppressWarning = suppressPatterns.some((pattern) => pattern.test(warnMessage));

  // Nếu không cần lọc, ghi log bình thường với timestamp
  if (!shouldSuppressWarning) {
    originalConsoleWarn.apply(console, [getTimestamp(), ...args]);
  }
};

// Thay thế console.log để thêm timestamp
console.log = function (...args) {
  originalConsoleLog.apply(console, [getTimestamp(), ...args]);
};

// Ghi đè xử lý lỗi không bắt được để ngăn chặn crash
process.on('unhandledRejection', (reason, promise) => {
  const errorMessage = reason ? String(reason) : '';

  // Kiểm tra xem có nên lọc lỗi này không
  const shouldSuppressError = suppressPatterns.some((pattern) => pattern.test(errorMessage));

  // Nếu không cần lọc, log lỗi để debug với timestamp
  if (!shouldSuppressError) {
    originalConsoleError(getTimestamp(), 'Unhandled Rejection at Promise:', promise, 'Reason:', reason);
  }
});

console.log('[Next.js] Warning suppression active');
