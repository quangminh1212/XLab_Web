'use strict';

// Polyfill cho Request API thiếu trong Node.js v20 với Next.js 15
if (typeof globalThis.Request === 'undefined') {
  const { Request: UndiciRequest, Headers: UndiciHeaders, Response: UndiciResponse, fetch: UndiciFetch } = require('undici');
  
  // Thêm các API Web thiếu vào global
  globalThis.Request = UndiciRequest;
  globalThis.Headers = globalThis.Headers || UndiciHeaders;
  globalThis.Response = globalThis.Response || UndiciResponse;
  globalThis.fetch = globalThis.fetch || UndiciFetch;
  
  // Thêm vào global của Node.js
  global.Request = UndiciRequest;
  global.Headers = global.Headers || UndiciHeaders;
  global.Response = global.Response || UndiciResponse;
  global.fetch = global.fetch || UndiciFetch;
}

// Đảm bảo fetch API luôn có sẵn
if (typeof globalThis.fetch === 'undefined') {
  const { fetch: UndiciFetch } = require('undici');
  globalThis.fetch = UndiciFetch;
  global.fetch = UndiciFetch;
}

// Polyfill for global object in Node.js environments
if (typeof global === 'undefined') {
  window.global = window;
}

// Polyfill for process in browser environments
if (typeof process === 'undefined') {
  window.process = {
    env: { NODE_ENV: process.env.NODE_ENV },
  };
}

// Polyfill for Buffer in browser environments
if (typeof Buffer === 'undefined') {
  window.Buffer = require('buffer').Buffer;
}

console.log('Request polyfills loaded for compatibility');

module.exports = {};
