/**
 * Logger utility để thêm timestamp vào các log messages
 * Giúp việc debug và phát triển dễ dàng hơn
 */

// Lưu lại các hàm console gốc
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalConsoleDebug = console.debug;

// Format timestamp dạng [YYYY-MM-DD HH:mm:ss.SSS]
const getTimestamp = (): string => {
  const now = new Date();
  return `[${now.toISOString().replace('T', ' ').slice(0, -1)}]`;
};

// Override console.log
console.log = function (...args: any[]): void {
  originalConsoleLog(getTimestamp(), ...args);
};

// Override console.info
console.info = function (...args: any[]): void {
  originalConsoleInfo(getTimestamp(), ...args);
};

// Override console.warn
console.warn = function (...args: any[]): void {
  originalConsoleWarn(getTimestamp(), ...args);
};

// Override console.error
console.error = function (...args: any[]): void {
  originalConsoleError(getTimestamp(), ...args);
};

// Override console.debug
console.debug = function (...args: any[]): void {
  originalConsoleDebug(getTimestamp(), ...args);
};

// Export các hàm logger nếu cần sử dụng trực tiếp
export const logger = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

export default logger; 