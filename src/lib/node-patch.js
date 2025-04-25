'use strict';

// Patch trực tiếp cho module request.js của Next.js
const fs = require('fs');
const path = require('path');

// Đường dẫn đến file cần patch
const requestFilePath = path.resolve('./node_modules/next/dist/server/web/spec-extension/request.js');

// In đường dẫn để debug
console.log('Looking for request.js at:', requestFilePath);

// Kiểm tra nếu file tồn tại
if (fs.existsSync(requestFilePath)) {
  console.log('File found, patching...');
  let content = fs.readFileSync(requestFilePath, 'utf8');
  
  // Log một phần nội dung để debug
  console.log('File content sample:', content.substring(0, 100));
  
  // Kiểm tra nếu file chưa được patch
  if (content.includes('const Request =') && !content.includes('// PATCHED')) {
    // Thêm polyfill vào đầu file
    const patchedContent = `"use strict";
// PATCHED to fix "Request is not defined" error on Node.js v20
if (typeof globalThis.Request === 'undefined') {
  const undici = require('undici');
  globalThis.Request = undici.Request;
  globalThis.Headers = undici.Headers;
  globalThis.Response = undici.Response;
  global.Request = undici.Request;
  global.Headers = undici.Headers;
  global.Response = undici.Response;
}
${content}`;
    
    // Ghi file đã patch
    fs.writeFileSync(requestFilePath, patchedContent, 'utf8');
    console.log('Successfully patched Next.js request.js file');
  } else {
    console.log('File already patched or does not need patching');
  }
} else {
  console.log('Could not find Next.js request.js file for patching');
}

module.exports = {}; 