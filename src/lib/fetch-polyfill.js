'use strict';

/**
 * Polyfill cho fetch API và Web APIs khác cho Node.js v20 với Next.js
 */

// Chỉ cần chạy polyfill này một lần
if (!global.__FETCH_POLYFILL_LOADED__) {
  // Import undici cho các polyfill
  try {
    const undici = require('undici');
    
    // API cần polyfill
    const apis = {
      fetch: undici.fetch,
      Request: undici.Request,
      Response: undici.Response,
      Headers: undici.Headers,
      FormData: undici.FormData,
      ReadableStream: undici.ReadableStream
    };
    
    // Thêm polyfill vào global/globalThis
    Object.entries(apis).forEach(([name, impl]) => {
      if (impl) {
        if (typeof global[name] === 'undefined') {
          global[name] = impl;
        }
        
        if (typeof globalThis[name] === 'undefined') {
          globalThis[name] = impl;
        }
      }
    });
    
    // Đánh dấu đã load polyfill
    global.__FETCH_POLYFILL_LOADED__ = true;
    
    // Chỉ log trong môi trường development và khi không chạy trong Jest
    if (process.env.NODE_ENV === 'development' && !process.env.JEST_WORKER_ID) {
      console.log('Web API polyfills loaded');
    }
  } catch (error) {
    console.warn('Failed to load Web API polyfills:', error.message);
  }
}

module.exports = {}; 