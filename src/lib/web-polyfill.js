/**
 * Polyfill cho Web API trong môi trường Node.js
 * Giải quyết lỗi "Request is not defined" trong Next.js 15
 */

// Kiểm tra môi trường và thêm polyfill nếu cần
if (typeof global.Request === 'undefined') {
  try {
    // Sử dụng undici nếu có sẵn (Node.js >= 16)
    const { Request: UndiciRequest } = require('undici');
    global.Request = UndiciRequest;
  } catch (error) {
    // Fallback đến polyfill đơn giản
    global.Request = class Request {
      constructor(input, init = {}) {
        this.url = input.toString();
        this.method = init.method || 'GET';
        this.headers = init.headers || {};
        this.body = init.body || null;
        this.credentials = init.credentials || 'same-origin';
        this.mode = init.mode || 'cors';
        this.signal = init.signal || null;
      }
    };
  }
}

// Polyfill cho các API Web khác
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = {};
      if (init) {
        Object.keys(init).forEach(key => {
          this.set(key, init[key]);
        });
      }
    }

    append(name, value) {
      const key = name.toLowerCase();
      this._headers[key] = this._headers[key] 
        ? `${this._headers[key]}, ${value}` 
        : value;
    }

    delete(name) {
      delete this._headers[name.toLowerCase()];
    }

    get(name) {
      return this._headers[name.toLowerCase()] || null;
    }

    has(name) {
      return name.toLowerCase() in this._headers;
    }

    set(name, value) {
      this._headers[name.toLowerCase()] = value;
    }
  };
} 