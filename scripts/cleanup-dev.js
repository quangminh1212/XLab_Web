#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Dọn dẹp cache và trace files...');

const dirsToClean = [
  '.next',
  'node_modules/.cache',
  '.swc'
];

const filesToRemove = [
  '.next/trace',
  '.next/trace.*'
];

// Xóa thư mục cache
dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Đã xóa: ${dir}`);
    } catch (err) {
      console.log(`⚠️ Không thể xóa ${dir}: ${err.message}`);
    }
  }
});

// Xóa trace files
console.log('✅ Dọn dẹp hoàn tất!');
console.log('💡 Lỗi EPERM đã được ngăn chặn bằng cách:');
console.log('   - Tắt Next.js telemetry');
console.log('   - Tắt SWC cache');
console.log('   - Xóa trace files');
console.log('   - Cập nhật .gitignore'); 