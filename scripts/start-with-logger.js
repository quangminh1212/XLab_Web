/**
 * Script to start Next.js with logger configuration
 * Bỏ timestamp trong log trong cmd theo yêu cầu
 */

// Định nghĩa hàm timestamp rỗng
const getTimestamp = () => {
  return '';
};

// Lưu các hàm console gốc
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalConsoleDebug = console.debug;

// Ghi đè các phương thức console để không thêm timestamp
console.log = function (...args) {
  originalConsoleLog(...args);
};

console.info = function (...args) {
  originalConsoleInfo(...args);
};

console.warn = function (...args) {
  originalConsoleWarn(...args);
};

console.error = function (...args) {
  originalConsoleError(...args);
};

console.debug = function (...args) {
  originalConsoleDebug(...args);
};

// Log khởi động ứng dụng
console.log('🚀 Starting Next.js application...');

// Khởi động Next.js
require('next/dist/bin/next'); 