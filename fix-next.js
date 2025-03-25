/**
 * Fix-Next.js - Script để sửa lỗi hoạt động của Next.js
 * 
 * Script này thực hiện các bước sau:
 * 1. Xóa cache .next
 * 2. Tạo file next-env.d.ts nếu cần
 * 3. Tạo các symbolic link cần thiết
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('==== XLab Next.js Fix Tool ====');

// Kiểm tra thư mục .next
if (fs.existsSync(path.join(process.cwd(), '.next'))) {
  console.log('Xóa thư mục .next...');
  try {
    fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true });
    console.log('Đã xóa thư mục .next thành công');
  } catch (err) {
    console.error('Lỗi khi xóa thư mục .next:', err);
  }
}

// Kiểm tra và cập nhật node_modules
console.log('Kiểm tra thư viện React và Next.js...');

const requiredModules = [
  'react',
  'react-dom',
  'next'
];

let needsInstall = false;

for (const mod of requiredModules) {
  const modulePath = path.join(process.cwd(), 'node_modules', mod);
  if (!fs.existsSync(modulePath)) {
    console.log(`Không tìm thấy module ${mod}`);
    needsInstall = true;
    break;
  }
}

if (needsInstall) {
  console.log('Cài đặt lại các thư viện cần thiết...');
  try {
    execSync('npm install react@18.2.0 react-dom@18.2.0 next@13.5.6 --legacy-peer-deps --force', 
      { stdio: 'inherit' });
    console.log('Đã cài đặt lại thư viện thành công');
  } catch (err) {
    console.error('Lỗi khi cài đặt thư viện:', err);
  }
}

// Tạo file next-env.d.ts nếu chưa có
const nextEnvPath = path.join(process.cwd(), 'next-env.d.ts');
if (!fs.existsSync(nextEnvPath)) {
  console.log('Tạo file next-env.d.ts...');
  const nextEnvContent = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/api-reference/next.config.js/introduction
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    SITE_NAME: string
    SITE_URL: string
    SITE_DESCRIPTION: string
  }
}`;
  
  try {
    fs.writeFileSync(nextEnvPath, nextEnvContent, 'utf8');
    console.log('Đã tạo file next-env.d.ts thành công');
  } catch (err) {
    console.error('Lỗi khi tạo file next-env.d.ts:', err);
  }
}

console.log('Fix hoàn tất! Có thể chạy "npm run dev" để khởi động dự án.'); 