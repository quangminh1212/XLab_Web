/**
 * File này chứa các polyfill cần thiết cho trình duyệt cũ hoặc môi trường không đầy đủ
 */

/**
 * Tạo polyfill cho JSON object
 * @returns JSON object polyfill
 */
export const createJSONPolyfill = () => {
  console.log('Creating JSON polyfill');
  
  return {
    parse: (text: string) => {
      try {
        return Function('"use strict";return (' + text + ')')();
      } catch (e) {
        console.error('JSON.parse polyfill failed:', e);
        return null;
      }
    },
    stringify: (obj: any): string => {
      try {
        const results: string[] = [];
        if (obj === null) return 'null';
        if (typeof obj === 'string') return '"' + obj.replace(/"/g, '\\"') + '"';
        if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
        if (typeof obj === 'undefined') return 'null';
        if (Array.isArray(obj)) {
          obj.forEach((item) => {
            let serialized = createJSONPolyfill().stringify(item);
            results.push(serialized);
          });
          return '[' + results.join(',') + ']';
        }
        if (typeof obj === 'object') {
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              let serialized = createJSONPolyfill().stringify(obj[key]);
              results.push('"' + key + '":' + serialized);
            }
          }
          return '{' + results.join(',') + '}';
        }
        return '{}';
      } catch (e) {
        console.error('JSON.stringify polyfill failed:', e);
        return '{}';
      }
    },
    // Symbol.toStringTag property trên JSON native object
    [Symbol.toStringTag]: 'JSON'
  };
};

/**
 * Áp dụng tất cả polyfill cần thiết
 * Gọi hàm này một lần khi khởi động ứng dụng
 */
export function applyPolyfills(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // JSON Object polyfill
  if (!('JSON' in window)) {
    (window as any).JSON = createJSONPolyfill();
  }
  
  // Object.entries polyfill
  if (!Object.entries) {
    Object.entries = function(obj: any) {
      const ownProps = Object.keys(obj);
      let i = ownProps.length;
      const resArray = new Array(i);
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }
      return resArray;
    };
  }
  
  // Array.isArray polyfill cho TypeScript
  if (!Array.isArray) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Array as any).isArray = function isArray(arg: any): arg is any[] {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  
  console.log('All polyfills applied');
} 