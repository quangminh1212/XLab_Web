/**
 * Các hàm xử lý JSON an toàn để tránh lỗi liên quan đến JSON.parse
 */

/**
 * Parse JSON một cách an toàn
 * @param text Chuỗi JSON cần parse
 * @param fallback Giá trị mặc định nếu parse thất bại
 */
export function safeJSONParse<T = any>(text: string, fallback: T | null = null): T | null {
  if (!text) return fallback;
  
  try {
    // Sử dụng function có sẵn thay vì truy cập trực tiếp JSON.parse
    return Function('"use strict"; return JSON.parse(arguments[0]);')(text);
  } catch (error) {
    console.error('Lỗi khi parse JSON:', error);
    return fallback;
  }
}

/**
 * Stringify JSON một cách an toàn
 * @param data Dữ liệu cần chuyển thành JSON string
 * @param fallback Giá trị mặc định nếu stringify thất bại
 */
export function safeJSONStringify(data: any, fallback: string = '{}'): string {
  try {
    // Sử dụng function có sẵn thay vì truy cập trực tiếp JSON.stringify
    return Function('"use strict"; return JSON.stringify(arguments[0], arguments[1], arguments[2]);')(data, null, 2);
  } catch (error) {
    console.error('Lỗi khi stringify JSON:', error);
    return fallback;
  }
}

/**
 * Thêm shim cho JSON nếu cần thiết
 * Chỉ được sử dụng trong môi trường phát triển
 */
export function ensureJSONMethods(): void {
  if (typeof window !== 'undefined') {
    try {
      // Test xem JSON có đang hoạt động không
      JSON.parse('{"test": true}');
    } catch (e) {
      console.warn('Phát hiện lỗi với JSON.parse, đang thử khắc phục...');
      
      // Định nghĩa lại JSON.parse an toàn
      const originalJSONParse = JSON.parse;
      JSON.parse = function safeParse(text) {
        try {
          return originalJSONParse(text);
        } catch (error) {
          console.error('Lỗi với JSON.parse gốc, sử dụng eval fallback');
          // Fallback: Sử dụng eval nếu JSON.parse không hoạt động
          return Function('"use strict";return (' + text + ')')();
        }
      };
    }
  }
} 