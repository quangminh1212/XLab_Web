'use strict';

const fs = require('fs');
const path = require('path');

// Tìm file từ node_modules/next/dist
function findFileInModules(pattern) {
  const basePath = path.resolve('./node_modules/next/dist');
  const files = [];
  
  function searchDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        searchDir(fullPath);
      } else if (entry.isFile() && entry.name.match(pattern)) {
        files.push(fullPath);
      }
    }
  }
  
  searchDir(basePath);
  return files;
}

// Tìm và patch tất cả các file request.js
console.log('Searching for request.js files to patch...');
const requestFiles = findFileInModules(/request\.js$/);

console.log(`Found ${requestFiles.length} request.js files:`);
requestFiles.forEach((file, index) => {
  console.log(`${index + 1}. ${file}`);
  
  // Patch file
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Kiểm tra nếu file chứa chuỗi 'globalThis.Request' và chưa patch
    if (content.includes('const Request =') && !content.includes('// PATCHED')) {
      // Thêm polyfill vào đầu file
      const patchedContent = `"use strict";
// PATCHED to fix "Request is not defined" error on Node.js v20
const undici = require('undici');
if (typeof globalThis.Request === 'undefined') {
  globalThis.Request = undici.Request;
  globalThis.Headers = globalThis.Headers || undici.Headers;
  globalThis.Response = globalThis.Response || undici.Response;
  global.Request = undici.Request;
  global.Headers = global.Headers || undici.Headers;
  global.Response = global.Response || undici.Response;
}
${content}`;
      
      // Ghi file đã patch
      fs.writeFileSync(file, patchedContent, 'utf8');
      console.log(`✅ Successfully patched: ${file}`);
    } else {
      console.log(`⚠️ File already patched or does not need patching: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error patching file ${file}:`, error.message);
  }
});

console.log('\nAll files have been processed.'); 