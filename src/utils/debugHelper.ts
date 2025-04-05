/**
 * Hàm debug nâng cao - in cả stack trace
 * @param message Thông báo cần in
 * @param data Dữ liệu kèm theo (nếu có)
 */
export function debugLog(message: string, data?: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('DEBUG:', message);
    if (data) {
      try {
        console.log(JSON.stringify(data, null, 2));
      } catch (err) {
        console.log('Không thể convert data sang JSON:', data);
      }
    }
    console.log('Stack:', new Error().stack);
  }
}

/**
 * Ghi log lỗi với stack trace đầy đủ
 * @param message Thông báo lỗi
 * @param error Đối tượng lỗi (nếu có)
 */
export function errorLog(message: string, error?: any): void {
  console.error('ERROR:', message);
  
  if (error) {
    if (error instanceof Error) {
      console.error('Thông báo lỗi:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Đối tượng lỗi:', error);
    }
  } else {
    console.error('Stack:', new Error().stack);
  }
}

/**
 * Bọc hàm trong try-catch và ghi log
 * @param fn Hàm cần thực thi
 * @param context Tên ngữ cảnh (để dễ debug)
 */
export function safeExecute<T>(fn: () => T, context: string): T | undefined {
  try {
    return fn();
  } catch (error) {
    errorLog(`Lỗi trong ${context}`, error);
    return undefined;
  }
} 