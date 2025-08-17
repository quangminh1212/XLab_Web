/**
 * Logger utility để thêm timestamp vào các log messages
 * Giúp việc debug và phát triển dễ dàng hơn
 */

type LogArgs = unknown[];

const isProd = process.env.NODE_ENV === 'production';

// In production: no-op; In dev: forward to console
const dev = {
  log: (...args: LogArgs) => console.log(...args),
  info: (...args: LogArgs) => console.info(...args),
  warn: (...args: LogArgs) => console.warn(...args),
  error: (...args: LogArgs) => console.error(...args),
  debug: (...args: LogArgs) => console.debug(...args),
};

const noop = {
  log: (..._args: LogArgs) => {},
  info: (..._args: LogArgs) => {},
  warn: (..._args: LogArgs) => {},
  error: (..._args: LogArgs) => {},
  debug: (..._args: LogArgs) => {},
};

export const logger = isProd ? noop : dev;
export default logger;
