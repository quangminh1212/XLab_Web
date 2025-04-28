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

// Ensure fetch is available
if (typeof fetch === 'undefined') {
  require('whatwg-fetch');
}

console.log('Request polyfills loaded for compatibility'); 