#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Đang chuẩn bị môi trường phát triển...');

// Tạo thư mục và file cần thiết
const createPath = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
};

// Danh sách file cần tạo
const filesToCreate = [
  '.next/server/vendor-chunks/next.js',
  '.next/server/vendor-chunks/tailwind-merge.js',
  '.next/static/css/empty.css',
  '.next/static/chunks/empty.js',
  '.next/static/app/page.js',
  '.next/static/app/not-found.js',
  '.next/static/app/layout.js',
  '.next/static/app/loading.js',
  '.next/static/app/empty.js',
  '.next/static/main-app.js',
  '.next/static/app-pages-internals.js'
];

console.log('📁 Tạo thư mục và file vendor-chunks cần thiết...');
filesToCreate.forEach(createPath);

// Xóa file trace nếu có
const tracePath = '.next/trace';
if (fs.existsSync(tracePath)) {
  try {
    fs.unlinkSync(tracePath);
    console.log('🗑️ Đã xóa file trace');
  } catch (err) {
    console.log('⚠️ Không thể xóa file trace:', err.message);
  }
}

console.log('✅ Chuẩn bị hoàn tất! Đang khởi động server...');

// Khởi động npm run dev
const npmProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

npmProcess.on('close', (code) => {
  console.log(`Server đã dừng với code: ${code}`);
});

npmProcess.on('error', (err) => {
  console.error('Lỗi khởi động server:', err.message);
}); 