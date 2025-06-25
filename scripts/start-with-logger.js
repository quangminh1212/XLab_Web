/**
 * Script to start Next.js with logger configuration
 * Thêm timestamp vào log trong cmd để dễ sửa lỗi và phát triển
 */

// Định nghĩa hàm thêm timestamp cho console
const getTimestamp = () => {
  const now = new Date();
  return `[${now.toISOString().replace('T', ' ').slice(0, -1)}]`;
};

// Lưu các hàm console gốc
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalConsoleDebug = console.debug;

// Ghi đè các phương thức console để thêm timestamp
console.log = function (...args) {
  originalConsoleLog(getTimestamp(), ...args);
};

console.info = function (...args) {
  originalConsoleInfo(getTimestamp(), ...args);
};

console.warn = function (...args) {
  originalConsoleWarn(getTimestamp(), ...args);
};

console.error = function (...args) {
  originalConsoleError(getTimestamp(), ...args);
};

console.debug = function (...args) {
  originalConsoleDebug(getTimestamp(), ...args);
};

// Log khởi động ứng dụng
console.log('🚀 Starting Next.js application with timestamped logging...');

// Khởi động Next.js
require('next/dist/bin/next'); 