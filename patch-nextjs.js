'use strict';

// Script để patch Next.js cho Node.js 20 compatibility
console.log('Patching Next.js for Node.js v20 compatibility...');

// Thêm polyfill cho global
require('./src/lib/request-polyfill');

// Patch trực tiếp file Next.js
require('./src/lib/node-patch');

console.log('Patch completed. Next.js is ready to run on Node.js v20.'); 