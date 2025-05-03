'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đường dẫn đến các file cần patch
const requestFile = path.resolve('./node_modules/next/dist/server/web/spec-extension/request.js');
const nextRequestFile = path.resolve('./node_modules/next/dist/server/web/spec-extension/adapters/next-request.js');

// Kiểm tra SWC được cài đặt chưa
function checkSWCInstalled() {
  const swcPath = path.resolve('./node_modules/@next/swc-win32-x64-msvc');
  const nextPath = path.resolve('./node_modules/next');
  const lockfilePath = path.resolve('./package-lock.json');
  
  const swcExists = fs.existsSync(swcPath);
  if (!swcExists && fs.existsSync(nextPath) && fs.existsSync(lockfilePath)) {
    console.log('SWC package missing. Installing...');
    try {
      execSync('npm install @next/swc-win32-x64-msvc@15.2.4 --save --no-fund --no-audit', { stdio: 'inherit' });
      return true;
    } catch (error) {
      console.error('Failed to install SWC:', error.message);
      return false;
    }
  }
  
  return swcExists;
}

// Kiểm tra và sửa file
console.log('Patching Next.js files for Node.js v20 compatibility...');

// Kiểm tra SWC package
checkSWCInstalled();

// Khởi tạo các file cần reset
const filesNeedReset = [requestFile, nextRequestFile];

// Reset các file bị sửa lỗi trước khi patch lại
filesNeedReset.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Nếu file chứa nhiều lần 'undici' hoặc có lỗi syntax
      if ((content.match(/undici/g) || []).length > 3 || 
          content.includes('compatibility\nconst undici')) {
        
        console.log(`Repairing corrupted file: ${filePath}`);
        
        // Tìm nội dung gốc của file (phần sau tất cả các PATCHED)
        let originalContent = content;
        const patchedMatches = content.match(/\/\/ PATCHED [^\n]+\n/g) || [];
        
        if (patchedMatches.length > 0) {
          const lastPatchIndex = content.lastIndexOf(patchedMatches[patchedMatches.length - 1]);
          if (lastPatchIndex > 0) {
            const patchEndIndex = lastPatchIndex + patchedMatches[patchedMatches.length - 1].length;
            originalContent = content.substring(patchEndIndex);
          }
        }
        
        // Ghi lại file với nội dung gốc
        fs.writeFileSync(filePath, originalContent, 'utf8');
        console.log(`Restored original content for ${filePath}`);
      }
    } catch (error) {
      console.error(`Error repairing file ${filePath}:`, error.message);
    }
  }
});

// Tạo polyfill code mới
const polyfillCode = `
// PATCHED for Node.js v20 compatibility
if (typeof globalThis.Request === 'undefined' || typeof globalThis.fetch === 'undefined') {
  try {
    const undici = require('undici');
    
    if (typeof globalThis.Request === 'undefined') globalThis.Request = undici.Request;
    if (typeof globalThis.Headers === 'undefined') globalThis.Headers = undici.Headers; 
    if (typeof globalThis.Response === 'undefined') globalThis.Response = undici.Response;
    if (typeof globalThis.fetch === 'undefined') globalThis.fetch = undici.fetch;
    
    if (typeof global.Request === 'undefined') global.Request = undici.Request;
    if (typeof global.Headers === 'undefined') global.Headers = undici.Headers;
    if (typeof global.Response === 'undefined') global.Response = undici.Response;
    if (typeof global.fetch === 'undefined') global.fetch = undici.fetch;
  } catch (e) {
    console.warn('Failed to load undici for Web API polyfills:', e.message);
  }
}

`;

// Hàm để patch file
function patchFile(filePath) {
  console.log(`Checking file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('// PATCHED for Node.js v20 compatibility')) {
    console.log(`File already patched: ${filePath}`);
    return;
  }
  
  // Thêm polyfill code vào đầu file
  const patchedContent = polyfillCode + content;
  fs.writeFileSync(filePath, patchedContent, 'utf8');
  console.log(`Successfully patched: ${filePath}`);
}

// Tạo thư mục fix-patches trong node_modules nếu chưa có
const patchesDir = path.resolve('./node_modules/.fix-patches');
if (!fs.existsSync(patchesDir)) {
  fs.mkdirSync(patchesDir, { recursive: true });
}

// Tạo file ghi nhớ đã patch
const patchMarker = path.join(patchesDir, 'node20-compat.json');
fs.writeFileSync(patchMarker, JSON.stringify({
  patched: true,
  timestamp: new Date().toISOString(),
  files: [requestFile, nextRequestFile],
  swcInstalled: checkSWCInstalled(),
}), 'utf8');

// Thực hiện patch
try {
  patchFile(requestFile);
  patchFile(nextRequestFile);
  console.log('Patching completed successfully!');
} catch (error) {
  console.error('Error patching files:', error);
} 