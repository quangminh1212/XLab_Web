'use strict';

// Hook cho Next.js để nạp các polyfill cần thiết
console.log('📋 Loading Web API polyfills for Next.js on Node.js v20...');

// Nạp polyfill cho Request API
require('./src/lib/request-polyfill');

// Tự động patch file của Next.js
require('./src/lib/node-patch');

console.log('✅ Polyfills loaded successfully.'); 